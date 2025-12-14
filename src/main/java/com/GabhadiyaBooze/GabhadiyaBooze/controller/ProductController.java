package com.GabhadiyaBooze.GabhadiyaBooze.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "*"})  // * for easy dev, change later
@RequestMapping("/api")
public class ProductController {

    private final List<Map<String, Object>> products = List.of(
            Map.of("id", 1, "name", "Jack Daniel's Old No.7 750ml", "price", 349.0,
                    "image", "https://cdn.shopify.com/s/files/1/0012/6291/3018/products/Jack_Daniels_Old_No_7_Whiskey_750ml_1.jpg", "category", "Whiskey"),
            Map.of("id", 2, "name", "Savanna Dry Cider 6-Pack", "price", 129.0,
                    "image", "https://cdn.shopify.com/s/files/1/0588/3845/3922/products/Savanna_Dry_330ml_NR_6_Pack.jpg", "category", "Cider"),
            Map.of("id", 3, "name", "Klipdrift Premium Brandy 750ml", "price", 219.0,
                    "image", "https://cdn.shopify.com/s/files/1/0012/6291/3018/products/Klipdrift_Premium_Brandy_750ml_1.jpg", "category", "Brandy"),
            Map.of("id", 4, "name", "Stellenbosch Cabernet Sauvignon 2021", "price", 179.0,
                    "image", "https://www.wine.co.za/Content/WineImages/Large/kanonkop-cabernet-sauvignon-2019-large.jpg", "category", "Wine"),
            Map.of("id", 5, "name", "Heineken Lager 12-Pack", "price", 189.0,
                    "image", "https://cdn.shopify.com/s/files/1/0588/3845/3922/products/Heineken_330ml_24_Pack_Cans.jpg", "category", "Beer"),
            Map.of("id", 6, "name", "Smirnoff Red Vodka 750ml", "price", 179.0,
                    "image", "https://cdn.shopify.com/s/files/1/0012/6291/3018/products/Smirnoff_Red_Vodka_750ml.jpg", "category", "Vodka")
    );

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return products;
    }
}