CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    customer_name VARCHAR(255) NOT NULL,

    invoice_number VARCHAR(100) NOT NULL,

    bill_date DATE NOT NULL,

    pdf_path TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);