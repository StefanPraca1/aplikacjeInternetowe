create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

CREATE TABLE comments (
                          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                          author TEXT NOT NULL,
                          message TEXT NOT NULL
);

