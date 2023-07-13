create TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(255),
  created_at DATE DEFAULT CURRENT_DATE,
  avatar VARCHAR(255)
);