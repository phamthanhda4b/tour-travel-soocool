package org.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/v1")
public class ProvinceController {

    private static final List<Map<String, Object>> PROVINCES = List.of(
            province("An Giang", "an-giang", "tinh", "Tỉnh An Giang", "89"),
            province("Bà Rịa - Vũng Tàu", "ba-ria---vung-tau", "tinh", "Tỉnh Bà Rịa - Vũng Tàu", "77"),
            province("Bạc Liêu", "bac-lieu", "tinh", "Tỉnh Bạc Liêu", "95"),
            province("Bắc Giang", "bac-giang", "tinh", "Tỉnh Bắc Giang", "24"),
            province("Bắc Kạn", "bac-kan", "tinh", "Tỉnh Bắc Kạn", "06"),
            province("Bắc Ninh", "bac-ninh", "tinh", "Tỉnh Bắc Ninh", "27"),
            province("Bến Tre", "ben-tre", "tinh", "Tỉnh Bến Tre", "83"),
            province("Bình Dương", "binh-duong", "tinh", "Tỉnh Bình Dương", "74"),
            province("Bình Định", "binh-dinh", "tinh", "Tỉnh Bình Định", "52"),
            province("Bình Phước", "binh-phuoc", "tinh", "Tỉnh Bình Phước", "70"),
            province("Bình Thuận", "binh-thuan", "tinh", "Tỉnh Bình Thuận", "60"),
            province("Cà Mau", "ca-mau", "tinh", "Tỉnh Cà Mau", "96"),
            province("Cao Bằng", "cao-bang", "tinh", "Tỉnh Cao Bằng", "04"),
            province("Cần Thơ", "can-tho", "thanh-pho", "Thành phố Cần Thơ", "92"),
            province("Đà Nẵng", "da-nang", "thanh-pho", "Thành phố Đà Nẵng", "48"),
            province("Đắk Lắk", "dak-lak", "tinh", "Tỉnh Đắk Lắk", "66"),
            province("Đắk Nông", "dak-nong", "tinh", "Tỉnh Đắk Nông", "67"),
            province("Điện Biên", "dien-bien", "tinh", "Tỉnh Điện Biên", "11"),
            province("Đồng Nai", "dong-nai", "tinh", "Tỉnh Đồng Nai", "75"),
            province("Đồng Tháp", "dong-thap", "tinh", "Tỉnh Đồng Tháp", "87"),
            province("Gia Lai", "gia-lai", "tinh", "Tỉnh Gia Lai", "64"),
            province("Hà Giang", "ha-giang", "tinh", "Tỉnh Hà Giang", "02"),
            province("Hà Nam", "ha-nam", "tinh", "Tỉnh Hà Nam", "35"),
            province("Hà Nội", "ha-noi", "thanh-pho", "Thành phố Hà Nội", "01"),
            province("Hà Tĩnh", "ha-tinh", "tinh", "Tỉnh Hà Tĩnh", "42"),
            province("Hải Dương", "hai-duong", "tinh", "Tỉnh Hải Dương", "30"),
            province("Hải Phòng", "hai-phong", "thanh-pho", "Thành phố Hải Phòng", "31"),
            province("Hậu Giang", "hau-giang", "tinh", "Tỉnh Hậu Giang", "93"),
            province("Hòa Bình", "hoa-binh", "tinh", "Tỉnh Hòa Bình", "17"),
            province("Hưng Yên", "hung-yen", "tinh", "Tỉnh Hưng Yên", "33"),
            province("Khánh Hòa", "khanh-hoa", "tinh", "Tỉnh Khánh Hòa", "56"),
            province("Kiên Giang", "kien-giang", "tinh", "Tỉnh Kiên Giang", "91"),
            province("Kon Tum", "kon-tum", "tinh", "Tỉnh Kon Tum", "62"),
            province("Lai Châu", "lai-chau", "tinh", "Tỉnh Lai Châu", "12"),
            province("Lâm Đồng", "lam-dong", "tinh", "Tỉnh Lâm Đồng", "68"),
            province("Long An", "long-an", "tinh", "Tỉnh Long An", "80"),
            province("Nam Định", "nam-dinh", "tinh", "Tỉnh Nam Định", "36"),
            province("Nghệ An", "nghe-an", "tinh", "Tỉnh Nghệ An", "40"),
            province("Ninh Bình", "ninh-binh", "tinh", "Tỉnh Ninh Bình", "37"),
            province("Ninh Thuận", "ninh-thuan", "tinh", "Tỉnh Ninh Thuận", "58"),
            province("Phú Thọ", "phu-tho", "tinh", "Tỉnh Phú Thọ", "25"),
            province("Phú Yên", "phu-yen", "tinh", "Tỉnh Phú Yên", "54"),
            province("Quảng Bình", "quang-binh", "tinh", "Tỉnh Quảng Bình", "44"),
            province("Quảng Nam", "quang-nam", "tinh", "Tỉnh Quảng Nam", "49"),
            province("Quảng Ngãi", "quang-ngai", "tinh", "Tỉnh Quảng Ngãi", "51"),
            province("Quảng Ninh", "quang-ninh", "tinh", "Tỉnh Quảng Ninh", "22"),
            province("Quảng Trị", "quang-tri", "tinh", "Tỉnh Quảng Trị", "45"),
            province("Sóc Trăng", "soc-trang", "tinh", "Tỉnh Sóc Trăng", "94"),
            province("Sơn La", "son-la", "tinh", "Tỉnh Sơn La", "14"),
            province("Tây Ninh", "tay-ninh", "tinh", "Tỉnh Tây Ninh", "72"),
            province("Thái Bình", "thai-binh", "tinh", "Tỉnh Thái Bình", "34"),
            province("Thái Nguyên", "thai-nguyen", "tinh", "Tỉnh Thái Nguyên", "19"),
            province("Thanh Hóa", "thanh-hoa", "tinh", "Tỉnh Thanh Hóa", "38"),
            province("Thừa Thiên Huế", "thua-thien-hue", "tinh", "Tỉnh Thừa Thiên Huế", "46"),
            province("Tiền Giang", "tien-giang", "tinh", "Tỉnh Tiền Giang", "82"),
            province("TP. Hồ Chí Minh", "ho-chi-minh", "thanh-pho", "Thành phố Hồ Chí Minh", "79"),
            province("Trà Vinh", "tra-vinh", "tinh", "Tỉnh Trà Vinh", "84"),
            province("Tuyên Quang", "tuyen-quang", "tinh", "Tỉnh Tuyên Quang", "08"),
            province("Vĩnh Long", "vinh-long", "tinh", "Tỉnh Vĩnh Long", "86"),
            province("Vĩnh Phúc", "vinh-phuc", "tinh", "Tỉnh Vĩnh Phúc", "26"),
            province("Yên Bái", "yen-bai", "tinh", "Tỉnh Yên Bái", "15"),
            province("Bắc Giang", "bac-giang", "tinh", "Tỉnh Bắc Giang", "24"),
            province("Bắc Kạn", "bac-kan", "tinh", "Tỉnh Bắc Kạn", "06"),
            province("Bạc Liêu", "bac-lieu", "tinh", "Tỉnh Bạc Liêu", "95"),
            province("Bến Tre", "ben-tre", "tinh", "Tỉnh Bến Tre", "83"),
            province("Hà Giang", "ha-giang", "tinh", "Tỉnh Hà Giang", "02"),
            province("Lào Cai", "lao-cai", "tinh", "Tỉnh Lào Cai", "10"),
            province("Hà Tây", "ha-tay", "tinh", "Tỉnh Hà Tây", "16")
    );

    @GetMapping("/provinces")
    public Map<String, Object> getAllProvinces() {
        Map<String, Object> response = new HashMap<>();
        response.put("nItems", PROVINCES.size());
        response.put("nPages", 1);
        response.put("data", PROVINCES);
        return response;
    }

    private static Map<String, Object> province(String name, String slug, String type, String nameWithType, String code) {
        Map<String, Object> item = new HashMap<>();
        item.put("_id", "prov-" + slug);
        item.put("name", name);
        item.put("slug", slug);
        item.put("type", type);
        item.put("name_with_type", nameWithType);
        item.put("code", code);
        item.put("isDeleted", false);
        return item;
    }
}
