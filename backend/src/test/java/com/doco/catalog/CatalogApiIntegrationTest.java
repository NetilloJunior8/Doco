package com.doco.catalog;

import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"sqlite", "test"})
class CatalogApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldListSeededCategoriesAndFilterByEra() throws Exception {
        mockMvc.perform(get("/api/v1/catalog/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));

        mockMvc.perform(get("/api/v1/catalog/products").param("era", "Y2K"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()", greaterThanOrEqualTo(3)))
                .andExpect(jsonPath("$.items[0].styleEra", is("Y2K")));
    }

    @Test
    void shouldReturnProductDetailBySlug() throws Exception {
        Product first = productRepository.findAll().getFirst();

        mockMvc.perform(get("/api/v1/catalog/products/{slug}", first.getSlug()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sku", is(first.getSku())))
                .andExpect(jsonPath("$.images", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void shouldRejectAdminEndpointWithoutTokenAndAllowWithAdminLogin() throws Exception {
        String createBody = """
                {
                  "sku": "DOCO-TEST-999",
                  "title": "Test Carhartt Vest",
                  "description": "Chaleco workwear vintage prueba",
                  "priceMxn": 1850.00,
                  "sizeLabel": "L",
                  "styleEra": "WORKWEAR",
                  "conditionGrade": "MINT_9_10",
                  "stock": 1,
                  "featured": false,
                  "categoryId": 1,
                  "brandId": 1,
                  "imageUrls": ["/assets/products/carhartt-detroit-jacket.jpg"]
                }
                """;

        mockMvc.perform(post("/api/v1/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isUnauthorized());

        String loginResponse = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@doco.mx\",\"password\":\"DocoAdmin#2026!\"}"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = com.jayway.jsonpath.JsonPath.read(loginResponse, "$.accessToken");

        mockMvc.perform(post("/api/v1/admin/products")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku", is("DOCO-TEST-999")));
    }
}
