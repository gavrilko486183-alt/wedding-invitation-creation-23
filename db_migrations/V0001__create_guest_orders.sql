CREATE TABLE t_p98537980_wedding_invitation_c.guest_orders (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    hot_dish VARCHAR(255),
    alcohol TEXT[],
    wish TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);