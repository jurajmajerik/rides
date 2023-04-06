package db

import (
	"os"
	"database/sql"
	"fmt"
	"log"
	"strconv"

	_ "github.com/lib/pq"
	"github.com/joho/godotenv"
)

// Global DB variable
var Connection *sql.DB

// initDB creates a new instance of DB
func InitDB() {
	err := godotenv.Load("../.env")
  if err != nil {
    log.Fatal(err)
  }

	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	host := os.Getenv("POSTGRES_HOST")
	dbname := os.Getenv("POSTGRES_DBNAME")
	portStr := os.Getenv("POSTGRES_PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		log.Fatal(err)
	}

	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		user, password, host, port, dbname,
	)

	var connErr error
	Connection, connErr = sql.Open("postgres", connStr)
	if connErr != nil {
		log.Fatal(connErr)
	}
}
