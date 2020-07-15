CREATE TABLE bread(
    id INTEGER PRIMARY KEY NOT NULL,
    string TEXT,
    integer INTEGER,
    float FLOAT,
    date DATE,
    boolean BOOLEAN
);

INSERT INTO bread (string, integer, float, date, boolean) VALUES ('Tri Sutrisna Bhayukusuma', 29, '9.9', '1990-11-12', 'true');
INSERT INTO bread (string, integer, float, date, boolean) VALUES ('Novrizaldi', 25, '8.8', '1995-07-25', 'true');
INSERT INTO bread (string, integer, float, date, boolean) VALUES ('Dwiko', 24, '8.6', '1993-05-15', 'false');