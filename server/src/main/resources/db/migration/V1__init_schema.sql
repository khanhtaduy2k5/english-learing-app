CREATE TABLE levels (
    level VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE app_users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    avatar_url VARCHAR(255)
);

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    lesson_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    quiz_score INT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE TABLE writing_feedback_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    input_text TEXT NOT NULL,
    overall_score INT,
    band VARCHAR(10),
    summary TEXT,
    feedback_json TEXT,
    prompt_tokens INT,
    completion_tokens INT,
    total_tokens INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE units (
    id VARCHAR(255) PRIMARY KEY,
    level VARCHAR(255) NOT NULL,
    number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    theme TEXT,
    emoji TEXT,
    checkpoint JSON NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE reading_passages (
    id VARCHAR(255) PRIMARY KEY,
    level VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    passage_text TEXT NOT NULL,
    questions JSON NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE localized_translations (
    id VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    locale VARCHAR(10) NOT NULL,
    translation_text TEXT NOT NULL
);

CREATE TABLE grammar_rules (
    id VARCHAR(255) PRIMARY KEY,
    level VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    rule TEXT NOT NULL,
    examples JSON NOT NULL,
    questions JSON NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE exams (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    emoji TEXT,
    description TEXT,
    variants JSON NOT NULL,
    full_exam JSON NOT NULL,
    quick_exam JSON NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_writing_feedback_user ON writing_feedback_logs (user_id);
CREATE INDEX idx_translation_lookup ON localized_translations (entity_type, entity_id, field_name, locale);
