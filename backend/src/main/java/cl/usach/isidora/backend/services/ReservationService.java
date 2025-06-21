package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.CustomerEntity;
import cl.usach.isidora.backend.entities.FrequencyDscEntity;
import cl.usach.isidora.backend.entities.GroupSizeDscEntity;
import cl.usach.isidora.backend.entities.ReservationEntity;
import cl.usach.isidora.backend.entities.TariffEntity;
import cl.usach.isidora.backend.repositories.CustomerRepository;
import cl.usach.isidora.backend.repositories.GroupSizeDscRepository;
import cl.usach.isidora.backend.repositories.ReservationRepository;
import cl.usach.isidora.backend.repositories.TariffRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private TariffRepository tariffRepository;
    @Autowired
    private FrequencyDscService frequencyDscService;
    @Autowired
    private GroupSizeDscService groupSizeDscService;
    @Autowired
    private TariffService tariffService;
    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private GroupSizeDscRepository groupSizeDscRepository;

    public List<ReservationEntity> getAllReservations(){
        return reservationRepository.findAll();
    }

    public ReservationEntity getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    public ReservationEntity createReservationWithCustomers(LocalDate date, Time startTime, Integer duration, Integer groupSize, List<CustomerEntity> customers) {
        // Calcular la hora de fin
        LocalTime localTime = startTime.toLocalTime().plusMinutes(duration);
        Time endTime = Time.valueOf(localTime);
        // Guardar los clientes si no existen
        customers.forEach(customer -> {
            customer.setVisitDate(date); // Asignar la fecha de la reserva
            if (customer.getId_customer() == null) {
                customerRepository.save(customer); // Guardar cliente si no existe
            }
        });

        // obtener precio de tarifa


        TariffEntity tariffEntity = tariffRepository.findByMaxMinutes(duration);
        Integer price =tariffEntity.getPrice();
        // Crear la reserva
        ReservationEntity reservation = new ReservationEntity();
        reservation.setDate(date);
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setGroupSize(groupSize);
        reservation.setBaseTariff(price);
        // Asociar los clientes a la reserva
        reservation.setCustomers(customers);

        // Guardar la reserva
        return reservationRepository.save(reservation);
    }

    @Transactional
    public ReservationEntity createReservationWithPricing(LocalDate date, Time startTime, Integer duration, 
                                              Integer groupSize, List<CustomerEntity> customers) {
        // Calcular tiempo fin de la reserva
        LocalTime localTime = startTime.toLocalTime().plusMinutes(duration);
        Time endTime = Time.valueOf(localTime);
        
        // guardar a los clientes
        customers.forEach(customer -> {
            customer.setVisitDate(date);
            if (customer.getId_customer() == null) {
                customerRepository.save(customer);
            }
        });

        // obtener precio base
        
        Integer basePrice = getTariffByDuration(duration);

        // Crear reserva
        ReservationEntity reservation = new ReservationEntity();
        reservation.setDate(date);
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setGroupSize(groupSize);
        reservation.setBaseTariff(basePrice);
        reservation.setCustomers(customers);
        for (CustomerEntity c : customers) {
            c.setReservation(reservation);
        }
        // guardar reserva inicial, sin los descuentos
        reservation = reservationRepository.save(reservation);
        
        // calcular precios de la reserva
        calculatePricing(reservation);
        
        // guardar la reserva actualizada
        return reservationRepository.save(reservation);
    }
    
    @Transactional
    public ReservationEntity calculatePricing(ReservationEntity reservation) {
        List<CustomerEntity> customers = reservation.getCustomers();
        List<GroupSizeDscEntity> groupSizeDscs = groupSizeDscService.getAllGroupSizeDsc();
        List<FrequencyDscEntity> frequencyDscs = frequencyDscService.getAllFrequencyDsc();
        double totalAmount = reservation.getBaseTariff();

        // Calcular los descuentos del tamaño del grupo que aplican por cliente
        List<Double> individualGroupSizeDscs = getCustomerGroup(customers,reservation);
        System.out.println("lista de descuentos individuales por grupo: "+ individualGroupSizeDscs);
        // Calcular los descuentos de frequencia que aplican por cliente
        List<Double> individualFreqDscs = getCustomerFreq(customers,reservation);
        System.out.println("lista de descuentos individuales por frequencia: "+ individualFreqDscs);
        // Calcular descuento por cumpleaños
        List<Double> individualBirthDayDscs = getCustomerBirthDay(customers,reservation);
        System.out.println("lista de descuentos individuales por cumple: "+ individualBirthDayDscs);
        List<Double> finalDscs = new ArrayList<>();
        // compara que descuento en mejor para cada customer
        for (int i = 0; i < customers.size(); i++) {
            double dsc1 = individualFreqDscs.get(i);
            double dsc2 = individualBirthDayDscs.get(i);
            double dsc3 = individualGroupSizeDscs.get(i);
            if(dsc1 > dsc2 && dsc1 >= dsc3){
                finalDscs.add(dsc1);
                System.out.println("descuento por frecuencia: "+ dsc1);
            }else if (dsc2 > dsc1 && dsc2 > dsc3) {
                finalDscs.add(dsc2);
                System.out.println("descuento por cumpleagnios: "+ dsc2);
            }else if (dsc3 > dsc1 && dsc3 > dsc2) {
                finalDscs.add(dsc3);
                System.out.println("descuento por tamaño de grupo : "+ dsc3);
            }else{
                finalDscs.add(0.0);
                System.out.println("No hay descuento ");
            }

        }
        // con el descuento final que se le aplicara a cada clientes se calculan su precio individual
        List<Double> individualPrices = new ArrayList<>();
        for (int j = 0; j < finalDscs.size(); j++) {
            double discount = 100.0 - finalDscs.get(j);
            double total = (reservation.getBaseTariff()* discount)/100.0;
            individualPrices.add(total);
        }


        // sumar los precios finales de cada integrante del grupo
        double finalTotalAmount = individualPrices.stream().mapToDouble(Double::doubleValue).sum();

        // actualizar los precios de la reserva
        reservation.setTotalAmount(finalTotalAmount);
        reservation.setIndividualDscs(finalDscs);
        reservation.setIndividualPrices(individualPrices);
        
        return reservation;
    }


    public List<Double> getCustomerFreq(List<CustomerEntity> customers,ReservationEntity reservation) {
        List<FrequencyDscEntity> freqDscs = frequencyDscService.getAllFrequencyDsc();
        List<Double> individualDscs = new ArrayList<>();
        for (CustomerEntity customer : customers) {


            // Contar las visitas en el mes de los clientes
            long visitsCount = customerService.countFrequentCustomers(customer, reservation.getDate());
            System.out.println("El cliente "+customer.getName() +"ha visistado : "+visitsCount);
            // Encontrar que descuento por frecuencia aplica
            for (FrequencyDscEntity frequency : freqDscs) {

                if (visitsCount >= frequency.getMinFrequency() &&
                        (frequency.getMaxFrequency() == null || visitsCount <= frequency.getMaxFrequency())) {
                    individualDscs.add(frequency.getDiscountPercentage());
                    break;
                }


            }


        }
        return individualDscs;
    }

    public List<Double> getCustomerGroup(List<CustomerEntity> customers,ReservationEntity reservation) {
        List<GroupSizeDscEntity> groupDscs = groupSizeDscService.getAllGroupSizeDsc();
        List<Double> individualDscs = new ArrayList<>();
        for (CustomerEntity customer : customers) {
            // Encontrar que descuento por frecuencia aplica
            for (GroupSizeDscEntity groupSize : groupDscs) {
                if (reservation.getGroupSize() >= groupSize.getMinGroupSize() &&
                        (groupSize.getMaxGroupSize() == null || reservation.getGroupSize() <= groupSize.getMaxGroupSize())) {
                    individualDscs.add(groupSize.getDiscountPercentage());
                    break;
                }

            }


        }
        return individualDscs;
    }

    public List<Double> getCustomerBirthDay(List<CustomerEntity> customers,ReservationEntity reservation) {
        List<Double> individualDscs = new ArrayList<>();
        for (CustomerEntity customer : customers) {

            if (customer.getBirthdate().getMonth() == reservation.getDate().getMonth()
                    && customer.getBirthdate().getDayOfMonth() == reservation.getDate().getDayOfMonth()) {
                System.out.println("esta de cumpleagnios");
                individualDscs.add(50.0);
            }else if(customer.getBirthdate() == null){
                System.out.println("La fecha es nula");
                individualDscs.add(0.0);
            }
            else{
                System.out.println("No esta de cumpleagnios");
                individualDscs.add(0.0);
            }


        }
        List<Double> finalIndvDsc = birthDayDscmax(individualDscs,reservation.getGroupSize());
        return finalIndvDsc;
    }
    public List<Double> birthDayDscmax(List<Double> individualDscs, int groupSize){
        
        int count = 0;
        int maxDscs =0;
        if(groupSize >= 1 && groupSize < 3){
            maxDscs = 0;
        }else if(groupSize >= 3 && groupSize < 6 ){
            maxDscs = 1;
        } else if (groupSize >= 6 && groupSize < 11) {
            maxDscs = 2;
        }
        for (int i = 0; i < individualDscs.size(); i++) {
            if(individualDscs.get(i) == 50.0){
                count++;
            }
        }
        if(count > maxDscs){
            int rest = count - maxDscs;
            for (int j = 0; j < individualDscs.size(); j++) {
                if(rest == 0){
                    break;
                }else{
                    if(individualDscs.get(j) == 50.0) {
                        individualDscs.set(j, 0.0);
                        rest--;
                    }
                }
            }
        }
        return individualDscs;
    }

    public Integer getTariffByDuration(Integer duration) {
        TariffEntity tariffEntity = tariffRepository.findByMaxMinutes(duration);
    if (tariffEntity != null) {
        System.out.println("Tarifa encontrada: " + tariffEntity.getPrice() + " para duración: " + duration);
        return tariffEntity.getPrice();
    }
    
    // Si no se encuentra ninguna tarifa, toma la más cercana o un valor predeterminado
    List<TariffEntity> tariffs = tariffService.getAllTariffs();
    if (!tariffs.isEmpty()) {
        // Ordenar y encontrar la tarifa más cercana
        TariffEntity closest = tariffs.get(0);
        int minDiff = Math.abs(closest.getTotal_duration() - duration);
        
        for (TariffEntity tariff : tariffs) {
            int diff = Math.abs(tariff.getTotal_duration() - duration);
            if (diff < minDiff) {
                minDiff = diff;
                closest = tariff;
            }
        }
        
        System.out.println("No hay tarifa exacta. Usando la más cercana: " + 
                          closest.getTotal_duration() + " minutos, precio: " + closest.getPrice());
        return closest.getPrice();
    }
    
    System.out.println("ADVERTENCIA: No se encontró ninguna tarifa, usando valor predeterminado");
    return 5000; // Valor predeterminado o lanza una excepción

    }

    public List<CustomerEntity> getCustomersByReservationId(Long id){
        ReservationEntity reservation = reservationRepository.findById(id).orElse(null);
        if (reservation != null) {
            return reservation.getCustomers();
        } else {
            return new ArrayList<>(); // Retorna una lista vacía si no se encuentra la reserva
        }

    }

    //  PDF con todos los clientes en una sola tabla
    private byte[] generateGroupReservationPDF(ReservationEntity reservation) throws DocumentException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.LETTER.rotate()); // Formato horizontal
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Título principal
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("Detalles de la Reserva", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" ")); // Espacio
        
        // Crear tabla 
        PdfPTable table = new PdfPTable(6); // 6 columnas
        table.setWidthPercentage(100);
        
        // Establecer anchos relativos de columnas
        float[] columnWidths = {1f, 1f, 1.5f, 2f, 1f, 1.5f};
        table.setWidths(columnWidths);
        
        // Estilo para encabezados
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        BaseColor headerColor = new BaseColor(240, 240, 240);
        
        // Encabezados de la tabla
        addHeaderCell(table, "Fecha Reserva", headerFont, headerColor);
        addHeaderCell(table, "Hora Reserva", headerFont, headerColor);
        addHeaderCell(table, "Nombre Cliente", headerFont, headerColor);
        addHeaderCell(table, "Correo", headerFont, headerColor);
        addHeaderCell(table, "Descuento", headerFont, headerColor);
        addHeaderCell(table, "Precio Individual", headerFont, headerColor);
        
        // Añadir datos de clientes
        List<CustomerEntity> customers = reservation.getCustomers();
        List<Double> discounts = reservation.getIndividualDscs();
        List<Double> prices = reservation.getIndividualPrices();
        
        for (int i = 0; i < customers.size(); i++) {
            CustomerEntity customer = customers.get(i);
            double discount = i < discounts.size() ? discounts.get(i) : 0.0;
            double price = i < prices.size() ? prices.get(i) : 0.0;
            
            table.addCell(reservation.getDate().toString());
            table.addCell(reservation.getStartTime().toString());
            table.addCell(customer.getName() + " " + customer.getLastname());
            table.addCell(customer.getEmail());
            
            // Celda de descuento 
            PdfPCell discountCell = new PdfPCell(new Phrase("- " + String.format("%.2f", discount) + " %"));
            discountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(discountCell);
            
            // Celda de precio 
            PdfPCell priceCell = new PdfPCell(new Phrase("$ " + String.format("%.2f", price)));
            priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(priceCell);
        }
        
        // Cálculo de IVA (19%)
        double iva = (reservation.getTotalAmount() * 19) / 100.0;
        
        // Añadir fila de IVA
        PdfPCell emptyCell = new PdfPCell(new Phrase(""));
        emptyCell.setBorder(PdfPCell.NO_BORDER);
        
        table.addCell(emptyCell);
        table.addCell(emptyCell);
        table.addCell(emptyCell);
        
        // Celda de texto "IVA"
        PdfPCell ivaLabelCell = new PdfPCell(new Phrase("IVA", headerFont));
        ivaLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        ivaLabelCell.setBorder(PdfPCell.NO_BORDER);
        table.addCell(ivaLabelCell);
        
        // Celda de porcentaje IVA
        PdfPCell ivaPercentCell = new PdfPCell(new Phrase("+ 19%"));
        ivaPercentCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(ivaPercentCell);
        
        // Celda de valor IVA
        PdfPCell ivaValueCell = new PdfPCell(new Phrase("$ " + String.format("%.2f", iva)));
        ivaValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(ivaValueCell);
        
        // Añadir fila de total
        table.addCell(emptyCell);
        table.addCell(emptyCell);
        table.addCell(emptyCell);
        
        // Celda de texto "Total"
        PdfPCell totalLabelCell = new PdfPCell(new Phrase("Total", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
        totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalLabelCell.setBorder(PdfPCell.NO_BORDER);
        table.addCell(totalLabelCell);
        
        // Celda de valor total 
        PdfPCell totalValueCell = new PdfPCell(new Phrase("$ " + String.format("%.2f", reservation.getTotalAmount())));
        totalValueCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        totalValueCell.setColspan(2);
        table.addCell(totalValueCell);
        
        document.add(table);
        
        // Añadir pie de página
        document.add(new Paragraph(" ")); 
        document.add(new Paragraph("¡Gracias por tu reserva! Te esperamos."));
        
        document.close();
        return baos.toByteArray();
    }

    // Método auxiliar para encabezados
    private void addHeaderCell(PdfPTable table, String text, Font font, BaseColor color) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setBackgroundColor(color);
        cell.setPadding(8);
        table.addCell(cell);
    }

    // para mandar el correo a los clientes con el PDF adjunto
    @Transactional
    public void sendReservationMail(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        List<CustomerEntity> customers = reservation.getCustomers();
        
        if (customers != null && !customers.isEmpty()) {
            try {
                // Generar PDF con todos los clientes
                byte[] pdfBytes = generateGroupReservationPDF(reservation);
                
                // Enviar el PDF a cada cliente
                for (CustomerEntity customer : customers) {
                    if (customer.getEmail() != null && !customer.getEmail().isEmpty()) {
                        try{
                        // Crear mensaje
                        MimeMessage message = emailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true);
                        helper.setTo(customer.getEmail());
                        helper.setSubject("Confirmación de tu reserva");
                        
                        // Contenido del email
                        String content = String.format(
                            "Hola %s,\n\n" +
                            "Adjunto encontrarás los detalles de tu reserva para el %s.\n\n" +
                            "¡Gracias por reservar con nosotros!",
                            customer.getName(),
                            reservation.getDate()
                        );
                        
                        helper.setText(content);
                        
                        // Adjuntar el PDF
                        helper.addAttachment("reserva_" + reservation.getId_reservation() + ".pdf", 
                                        new ByteArrayResource(pdfBytes));
                        
                        // Enviar el correo
                        emailSender.send(message);
                        System.out.println("Correo con PDF enviado a: " + customer.getEmail());
                        }catch (Exception e) {
                            System.err.println("Error al enviar correo a " + customer.getEmail() + ": " + e.getMessage());
                            e.printStackTrace();
                        }
                    } 
                    
                }
            } catch (Exception e) {
                System.err.println("Error al generar el PDF: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("La reserva no tiene clientes asociados");
        }
    }


    // para los reportes:



    // Genera un reporte de ingresos agrupados por tarifas (vueltas/tiempo)

    public Map<String, Object> generateLapsTimeReport(LocalDate startDate, LocalDate endDate) {
        // Obtener todas las reservas en el rango de fechas
        List<ReservationEntity> reservations = reservationRepository.findByDateBetween(startDate, endDate);
        
        // Obtener todas las tarifas para categorizar
        List<TariffEntity> tariffs = tariffRepository.findAll();
        
        // Definir las categorías (tipos de tarifa)
        List<Map<String, Object>> categories = tariffs.stream()
            .map(tariff -> {
                Map<String, Object> category = new HashMap<>();
                category.put("id", tariff.getId_tariff());
                category.put("name", tariff.getLaps() + " vueltas / " + tariff.getMaxMinutes() + " minutos");
                category.put("laps", tariff.getLaps());
                category.put("minutes", tariff.getMaxMinutes());
                return category;
            })
            .collect(Collectors.toList());
        
        // Obtener los meses en el rango de fechas
        List<YearMonth> months = getMonthsBetween(startDate, endDate);
        
        // Crear estructura para almacenar los datos por categoría y mes
        Map<Long, Map<YearMonth, Double>> tariffMonthlyRevenue = new HashMap<>();
        
        // Inicializar la estructura con ceros
        for (TariffEntity tariff : tariffs) {
            Map<YearMonth, Double> monthlyRevenue = new HashMap<>();
            for (YearMonth month : months) {
                monthlyRevenue.put(month, 0.0);
            }
            tariffMonthlyRevenue.put(tariff.getId_tariff(), monthlyRevenue);
        }
        
        // Procesar reservas y agrupar ingresos
        for (ReservationEntity reservation : reservations) {
            if (reservation.getBaseTariff() != null) {
                // Determinar a qué tarifa corresponde esta reserva                
                Optional<TariffEntity> matchingTariff = tariffs.stream()
                    .filter(t -> t.getPrice().equals(reservation.getBaseTariff()))
                    .findFirst();
                
                if (matchingTariff.isPresent()) {
                    Long tariffId = matchingTariff.get().getId_tariff();
                    YearMonth month = YearMonth.from(reservation.getDate());
                    
                    // Actualizar ingresos para esta tarifa y este mes
                    Map<YearMonth, Double> monthlyRevenue = tariffMonthlyRevenue.get(tariffId);
                    double currentRevenue = monthlyRevenue.getOrDefault(month, 0.0);
                    monthlyRevenue.put(month, currentRevenue + reservation.getTotalAmount());
                }
            }
        }
        
        // Formatear datos para la respuesta
        List<Map<String, Object>> reportData = new ArrayList<>();
        double[] totalsByMonth = new double[months.size()];
        double grandTotal = 0.0;
        
        for (Map<String, Object> category : categories) {
            Long tariffId = (Long) category.get("id");
            Map<YearMonth, Double> monthlyRevenue = tariffMonthlyRevenue.get(tariffId);
            
            double[] values = new double[months.size()];
            double categoryTotal = 0.0;
            
            for (int i = 0; i < months.size(); i++) {
                YearMonth month = months.get(i);
                double revenue = monthlyRevenue.getOrDefault(month, 0.0);
                values[i] = revenue;
                totalsByMonth[i] += revenue;
                categoryTotal += revenue;
                grandTotal += revenue;
            }
            
            Map<String, Object> categoryData = new HashMap<>(category);
            categoryData.put("values", values);
            categoryData.put("total", categoryTotal);
            reportData.add(categoryData);
        }
        
        // Convertir meses a formato legible
        List<String> monthLabels = months.stream()
            .map(m -> m.getMonth().getDisplayName(TextStyle.FULL, Locale.getDefault()) + " " + m.getYear())
            .collect(Collectors.toList());
        
        // Estructurar respuesta final
        Map<String, Object> result = new HashMap<>();
        result.put("reportType", "lapsTime");
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        result.put("categories", categories);
        result.put("months", monthLabels);
        result.put("data", reportData);
        result.put("totalsByMonth", totalsByMonth);
        result.put("grandTotal", grandTotal);
        
        return result;
    }
    

    // Obtiene una lista de los meses entre dos fechas
    private List<YearMonth> getMonthsBetween(LocalDate startDate, LocalDate endDate) {
        List<YearMonth> months = new ArrayList<>();
        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);
        
        while (!start.isAfter(end)) {
            months.add(start);
            start = start.plusMonths(1);
        }
        
        return months;
    }





    //Genera un reporte de ingresos agrupados por tamaño de grupo
    public Map<String, Object> generateGroupSizeReport(LocalDate startDate, LocalDate endDate) {
        // Obtener todas las reservas en el rango de fechas
        List<ReservationEntity> reservations = reservationRepository.findByDateBetween(startDate, endDate);
        
        // Obtener categorías de tamaño de grupo
        List<GroupSizeDscEntity> groupSizeRanges = groupSizeDscRepository.findAll();
        
        // Definir las categorías (rangos de tamaño)
        List<Map<String, Object>> categories = groupSizeRanges.stream()
            .map(range -> {
                Map<String, Object> category = new HashMap<>();
                category.put("id", range.getIdGroupSizeDsc());
                category.put("name", range.getMinGroupSize() + "-" + range.getMaxGroupSize() + " personas");
                category.put("min", range.getMinGroupSize());
                category.put("max", range.getMaxGroupSize());
                return category;
            })
            .collect(Collectors.toList());
        
        // Obtener los meses en el rango de fechas
        List<YearMonth> months = getMonthsBetween(startDate, endDate);
        
        // Crear estructura para almacenar los datos por categoría y mes
        Map<Long, Map<YearMonth, Double>> groupSizeMonthlyRevenue = new HashMap<>();
        
        // Inicializar la estructura con ceros
        for (GroupSizeDscEntity range : groupSizeRanges) {
            Map<YearMonth, Double> monthlyRevenue = new HashMap<>();
            for (YearMonth month : months) {
                monthlyRevenue.put(month, 0.0);
            }
            groupSizeMonthlyRevenue.put(range.getIdGroupSizeDsc(), monthlyRevenue);
        }
        
        // Procesar reservas y agrupar ingresos
        for (ReservationEntity reservation : reservations) {
            if (reservation.getGroupSize() != null && reservation.getTotalAmount() != null) {
                // Encontrar la categoría correspondiente al tamaño de grupo
                Optional<GroupSizeDscEntity> matchingRange = groupSizeRanges.stream()
                    .filter(range -> 
                        reservation.getGroupSize() >= range.getMinGroupSize() && 
                        reservation.getGroupSize() <= range.getMaxGroupSize())
                    .findFirst();
                
                if (matchingRange.isPresent()) {
                    Long rangeId = matchingRange.get().getIdGroupSizeDsc();
                    YearMonth month = YearMonth.from(reservation.getDate());
                    
                    // Actualizar ingresos para este rango y este mes
                    Map<YearMonth, Double> monthlyRevenue = groupSizeMonthlyRevenue.get(rangeId);
                    if (monthlyRevenue != null && month != null) {
                        double currentRevenue = monthlyRevenue.getOrDefault(month, 0.0);
                        monthlyRevenue.put(month, currentRevenue + reservation.getTotalAmount());
                    }
                }
            }
        }
        
        // Formatear datos para la respuesta
        List<Map<String, Object>> reportData = new ArrayList<>();
        double[] totalsByMonth = new double[months.size()];
        double grandTotal = 0.0;
        
        for (Map<String, Object> category : categories) {
            Long rangeId = (Long) category.get("id");
            Map<YearMonth, Double> monthlyRevenue = groupSizeMonthlyRevenue.get(rangeId);
            
            double[] values = new double[months.size()];
            double categoryTotal = 0.0;
            
            for (int i = 0; i < months.size(); i++) {
                YearMonth month = months.get(i);
                double revenue = monthlyRevenue.getOrDefault(month, 0.0);
                values[i] = revenue;
                totalsByMonth[i] += revenue;
                categoryTotal += revenue;
                grandTotal += revenue;
            }
            
            Map<String, Object> categoryData = new HashMap<>(category);
            categoryData.put("values", values);
            categoryData.put("total", categoryTotal);
            reportData.add(categoryData);
        }
        
        // Convertir meses a formato legible
        List<String> monthLabels = months.stream()
            .map(m -> m.getMonth().getDisplayName(TextStyle.FULL, Locale.getDefault()) + " " + m.getYear())
            .collect(Collectors.toList());
        
        // Estructurar respuesta final
        Map<String, Object> result = new HashMap<>();
        result.put("reportType", "groupSize");
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        result.put("categories", categories);
        result.put("months", monthLabels);
        result.put("data", reportData);
        result.put("totalsByMonth", totalsByMonth);
        result.put("grandTotal", grandTotal);
        
        return result;
    }
}