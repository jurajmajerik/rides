package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

// Global DB variable
var Connection *sql.DB

// initDB creates a new instance of DB
func InitDB() {
	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		"postgres", "mysecretpassword", "db", 5432, "postgres",
	)

	var err error
	Connection, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println(err)
	}
}
