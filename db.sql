DROP TABLE IF EXISTS service_category_mapping;
DROP TABLE IF EXISTS service_region_mapping;
DROP TABLE IF EXISTS weekdays_mapping;
DROP TABLE IF EXISTS time_section_mapping;
DROP TABLE IF EXISTS service_plan;
DROP TABLE IF EXISTS service_category;
DROP TABLE IF EXISTS service_region;
DROP TABLE IF EXISTS weekdays;
DROP TABLE IF EXISTS time_Section;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS service_provider;
DROP TABLE IF EXISTS service_user;


CREATE TABLE service_user(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL ,
    authentication VARCHAR(255) ,
    full_name VARCHAR ,
    phone_no INTEGER ,
    service_region VARCHAR  ,
    address VARCHAR  ,
    avatar VARCHAR  ,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service_provider (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL ,
    password VARCHAR(255)  ,
    authentication VARCHAR(255)  ,
    is_available BOOLEAN  ,
    full_name VARCHAR  ,
    phone_no INTEGER  ,
    date_of_birth DATE  ,
    avatar VARCHAR  ,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service_category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service_category_mapping (
    id SERIAL PRIMARY KEY,
    service_provider_id INTEGER,
    service_category_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (service_provider_id) REFERENCES service_provider(id),
    FOREIGN KEY (service_category_id) REFERENCES service_category(id)
);

CREATE TABLE service_region (
    id SERIAL PRIMARY KEY,
    region_name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service_region_mapping(
    id SERIAL PRIMARY KEY,
    service_provider_id INTEGER,
    service_region_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (service_provider_id) REFERENCES service_provider(id),
    FOREIGN KEY (service_region_id) REFERENCES service_region(id)
);

CREATE TABLE weekdays (
    id SERIAL PRIMARY KEY,
    weekdays VARCHAR
);

CREATE TABLE weekdays_mapping (
    id SERIAL PRIMARY KEY,
    service_provider_id INTEGER,	
    weekdays_available_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (service_provider_id) REFERENCES service_provider(id),
    FOREIGN KEY (weekdays_available_id) REFERENCES weekdays(id)
);

CREATE TABLE time_section (
    id SERIAL PRIMARY KEY,
    time_section VARCHAR
);

CREATE TABLE time_section_mapping(
    id SERIAL PRIMARY KEY,
    service_provider_id INTEGER,
    time_section_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (service_provider_id) REFERENCES service_provider(id),
    FOREIGN KEY (time_section_id) REFERENCES time_section(id)
);

CREATE TABLE service_plan(
    id SERIAL PRIMARY KEY,
    service_category_id INTEGER,
    plan_hour INTEGER,
    plan_price INTEGER,
    plan_description VARCHAR,
    FOREIGN KEY (service_category_id) REFERENCES service_category(id)
);

CREATE TYPE STAT AS ENUM ('pending', 'accepted', 'declined', 'payment', 'refund', 'completed');
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    order_id VARCHAR,
    status STAT,
    selected_date DATE,
    service_start_time VARCHAR,
    service_user_id INTEGER,
    service_user_full_name VARCHAR,
    service_user_phone_no INTEGER,
    service_region VARCHAR,
    service_user_address VARCHAR,
    service_user_payment VARCHAR,
    service_user_remark TEXT,
    service_provider_id INTEGER,
    service_provider_full_name VARCHAR,
    service_provider_avatar VARCHAR,
    service_name VARCHAR,
    service_plan_id INTEGER,
    service_plan_hour INTEGER,
    service_plan_price INTEGER,
    service_plan_description TEXT,
    order_total_amount INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (service_provider_id) REFERENCES service_provider(id),
    FOREIGN KEY (service_user_id) REFERENCES service_user(id),
    FOREIGN KEY (service_plan_id) REFERENCES service_plan(id)
);
