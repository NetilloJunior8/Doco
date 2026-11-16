-- PostgreSQL production baseline schema for DOCO Archival Catalog & Commerce

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(300),
    image_url VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_categories_active_order ON categories (active, display_order);

CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    origin_country VARCHAR(60),
    featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    sku VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description VARCHAR(2000) NOT NULL,
    price_mxn NUMERIC(12, 2) NOT NULL,
    compare_at_price_mxn NUMERIC(12, 2),
    size_label VARCHAR(30) NOT NULL,
    measurements VARCHAR(180),
    style_era VARCHAR(30) NOT NULL,
    condition_grade VARCHAR(30) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 1,
    drop_tag VARCHAR(40),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    brand_id BIGINT NOT NULL REFERENCES brands(id)
);
CREATE INDEX idx_products_active_era ON products (active, style_era);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_brand ON products (brand_id);

CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER NOT NULL DEFAULT 0,
    primary_image BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    order_number VARCHAR(40) NOT NULL UNIQUE,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(160) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(80) NOT NULL,
    shipping_postal_code VARCHAR(12) NOT NULL,
    shipping_address VARCHAR(300) NOT NULL,
    subtotal_mxn NUMERIC(12, 2) NOT NULL,
    shipping_mxn NUMERIC(12, 2) NOT NULL,
    total_mxn NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    payment_provider VARCHAR(30) NOT NULL,
    external_reference VARCHAR(160),
    checkout_url VARCHAR(1000)
);
CREATE INDEX idx_orders_status ON orders (status);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    sku_snapshot VARCHAR(50) NOT NULL,
    title_snapshot VARCHAR(150) NOT NULL,
    unit_price_mxn NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    line_total_mxn NUMERIC(12, 2) NOT NULL
);

CREATE TABLE payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    provider VARCHAR(30) NOT NULL,
    provider_event_id VARCHAR(150) NOT NULL UNIQUE,
    amount_mxn NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'MXN',
    status VARCHAR(40) NOT NULL,
    payload_sha256 VARCHAR(64)
);

CREATE TABLE app_users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    email VARCHAR(160) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);
