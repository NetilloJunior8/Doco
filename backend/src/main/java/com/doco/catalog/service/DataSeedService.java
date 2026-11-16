package com.doco.catalog.service;

import com.doco.catalog.config.SecurityProperties;
import com.doco.catalog.domain.entity.AppUser;
import com.doco.catalog.domain.entity.Brand;
import com.doco.catalog.domain.entity.Category;
import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.domain.enums.GarmentCondition;
import com.doco.catalog.domain.enums.StyleEra;
import com.doco.catalog.domain.enums.UserRole;
import com.doco.catalog.repository.AppUserRepository;
import com.doco.catalog.repository.BrandRepository;
import com.doco.catalog.repository.CategoryRepository;
import com.doco.catalog.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds initial DOCO catalog categories, heritage streetwear brands, drop #01 pieces, and admin account.
 */
@Service
public class DataSeedService implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityProperties securityProperties;

    public DataSeedService(
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            ProductRepository productRepository,
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SecurityProperties securityProperties
    ) {
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityProperties = securityProperties;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
        if (productRepository.count() > 0) {
            return;
        }

        Category outerwear = categoryRepository.findBySlug("outerwear")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Outerwear & Chamarras", "outerwear",
                        "Workwear Detroit, chamarras gráficas y piezas pesadas vintage.",
                        "/assets/products/carhartt-detroit-jacket.jpg", 1)));
        Category hoodies = categoryRepository.findBySlug("hoodies")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Hoodies & Zip-Ups", "hoodies",
                        "Full-zip archival, BAPE camo y streetwear pesado.",
                        "/assets/products/bape-camo-shark-hoodie.jpg", 2)));
        Category denim = categoryRepository.findBySlug("denim")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Denim Y2K & Baggy", "denim",
                        "Cortes anchos 2000s, bordados Ed Hardy y raw selvedge Southpole.",
                        "/assets/products/ed-hardy-tiger-denim.jpg", 3)));
        Category accessories = categoryRepository.findBySlug("accesorios")
                .orElseGet(() -> categoryRepository.save(new Category(
                        "Gorras & Lentes", "accesorios",
                        "Trucker caps góticas Affliction y lentes de archivo Y2K.",
                        "/assets/products/burberry-silver-frames.jpg", 4)));

        Brand carhartt = brandRepository.findBySlug("carhartt")
                .orElseGet(() -> brandRepository.save(new Brand("Carhartt", "carhartt", "USA", true)));
        Brand bape = brandRepository.findBySlug("bape")
                .orElseGet(() -> brandRepository.save(new Brand("A Bathing Ape", "bape", "Japan", true)));
        Brand southpole = brandRepository.findBySlug("southpole")
                .orElseGet(() -> brandRepository.save(new Brand("Southpole", "southpole", "USA", true)));
        Brand edHardy = brandRepository.findBySlug("ed-hardy")
                .orElseGet(() -> brandRepository.save(new Brand("Ed Hardy", "ed-hardy", "USA", true)));
        Brand affliction = brandRepository.findBySlug("affliction")
                .orElseGet(() -> brandRepository.save(new Brand("Affliction", "affliction", "USA", true)));
        Brand burberry = brandRepository.findBySlug("burberry")
                .orElseGet(() -> brandRepository.save(new Brand("Burberry", "burberry", "UK", true)));

        List<Product> drop01 = List.of(
                buildProduct("DOCO-CRH-001", "Carhartt Detroit Work Jacket Tan",
                        "Chamarra Carhartt Detroit clásica en lona duck canvas beige deslavada con cuello en contraste gris carbón, cierre frontal latón y bolsillo pecho con etiqueta de cuero original.",
                        new BigDecimal("3490.00"), new BigDecimal("4200.00"),
                        "L", "Pecho 63cm · Largo 67cm · Manga 64cm",
                        StyleEra.WORKWEAR, GarmentCondition.VINTAGE_8_10, 1, "DROP #01", true,
                        outerwear, carhartt, "/assets/products/carhartt-detroit-jacket.jpg"),

                buildProduct("DOCO-BPE-002", "A Bathing Ape 1st Camo Shark Full-Zip Hoodie",
                        "Sudadera BAPE Shark auténtica con etiquetas originales, camuflaje verde clásico, cierre completo hasta capucha y bordado WGM / dientes Shark impecables.",
                        new BigDecimal("6890.00"), new BigDecimal("7900.00"),
                        "XXL", "Pecho 66cm · Largo 74cm · Fit Oversized",
                        StyleEra.STREETWEAR, GarmentCondition.DEADSTOCK, 1, "DROP #01 // GRAIL", true,
                        hoodies, bape, "/assets/products/bape-camo-shark-hoodie.jpg"),

                buildProduct("DOCO-SP-003", "Southpole Red Graphic Subway Trucker Jacket",
                        "Chamarra roja archival Southpole deadstock con etiqueta colgante original y gráfico ilustrado en espalda estilo metro NYC.",
                        new BigDecimal("2650.00"), null,
                        "XL", "Pecho 64cm · Largo 70cm",
                        StyleEra.Y2K, GarmentCondition.DEADSTOCK, 1, "DROP #01", true,
                        outerwear, southpole, "/assets/products/southpole-red-jacket.jpg"),

                buildProduct("DOCO-EDH-004", "Ed Hardy Tiger Embroidered Baggy Jeans",
                        "Denim vintage Ed Hardy con tigre bordado multicolor en bolsa trasera, botón metálico grabado y parche de piel autenticado.",
                        new BigDecimal("2390.00"), new BigDecimal("2850.00"),
                        "34x32", "Cintura 44cm · Tiro 32cm · Apertura 24cm",
                        StyleEra.Y2K, GarmentCondition.MINT_9_10, 1, "DROP #01", true,
                        denim, edHardy, "/assets/products/ed-hardy-tiger-denim.jpg"),

                buildProduct("DOCO-SP-005", "Southpole Authentic Super Blue Raw Denim",
                        "Jeans Southpole Authentic Collection tono Super Blue sin uso (con cartón y código original de época), costura naranja contrastante.",
                        new BigDecimal("2190.00"), null,
                        "34x32", "Cintura 43cm · Largo 108cm · Baggy Fit",
                        StyleEra.Y2K, GarmentCondition.DEADSTOCK, 1, "DROP #01", false,
                        denim, southpole, "/assets/products/southpole-super-blue-denim.jpg"),

                buildProduct("DOCO-AFL-006", "Affliction Live Fast Gothic Cross Trucker Cap",
                        "Gorra trucker Affliction nueva con etiqueta original, bordado gótico metálico con cruz central, cadenas grabadas y malla trasera.",
                        new BigDecimal("1190.00"), null,
                        "OS", "Ajustable Snapback · Corona media",
                        StyleEra.Y2K, GarmentCondition.DEADSTOCK, 1, "DROP #01", true,
                        accessories, affliction, "/assets/products/affliction-gothic-cap.jpg"),

                buildProduct("DOCO-BUR-007", "Burberry London Silver Rim Y2K Sunglasses",
                        "Lentes solares Burberry armazón metálico plateado rectangular de archivo con caja original Luxottica y certificados.",
                        new BigDecimal("3890.00"), new BigDecimal("4600.00"),
                        "OS", "Frente 142mm · Puente 16mm · Varilla 140mm",
                        StyleEra.ARCHIVE, GarmentCondition.DEADSTOCK, 1, "VAULT ARCHIVE", true,
                        accessories, burberry, "/assets/products/burberry-silver-frames.jpg"),

                buildProduct("DOCO-VAULT-008", "DOCO Vault Curated Capsule Preview Lot",
                        "Selección curada del Primer Drop: Carhartt Detroit, Southpole Raw, NASCAR Racing Jacket y Tapout Y2K Zip disponibles por pieza o lote.",
                        new BigDecimal("2950.00"), null,
                        "MIX", "L / XL · Piezas únicas verificadas",
                        StyleEra.VINTAGE, GarmentCondition.MINT_9_10, 2, "COMING SOON", false,
                        outerwear, carhartt, "/assets/products/drop-01-archival-bundle.jpg")
        );

        productRepository.saveAll(drop01);
    }

    private void seedAdminUser() {
        String email = securityProperties.bootstrapAdminEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }
        AppUser admin = new AppUser();
        admin.setFullName("DOCO Admin");
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(securityProperties.bootstrapAdminPassword()));
        admin.setRole(UserRole.ROLE_ADMIN);
        userRepository.save(admin);
    }

    private Product buildProduct(
            String sku,
            String title,
            String description,
            BigDecimal priceMxn,
            BigDecimal compareAt,
            String size,
            String measurements,
            StyleEra era,
            GarmentCondition condition,
            int stock,
            String dropTag,
            boolean featured,
            Category category,
            Brand brand,
            String imageUrl
    ) {
        Product p = new Product();
        p.setSku(sku);
        p.setTitle(title);
        p.setSlug(SlugUtils.toSlug(title + "-" + sku));
        p.setDescription(description);
        p.setPriceMxn(priceMxn);
        p.setCompareAtPriceMxn(compareAt);
        p.setSizeLabel(size);
        p.setMeasurements(measurements);
        p.setStyleEra(era);
        p.setConditionGrade(condition);
        p.setStock(stock);
        p.setDropTag(dropTag);
        p.setFeatured(featured);
        p.setCategory(category);
        p.setBrand(brand);
        p.addImage(imageUrl, title, 0, true);
        return p;
    }
}
