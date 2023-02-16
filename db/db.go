package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

// Global DB variable
var Connection *sql.DB

type Config struct {
	User     string `json:"user"`
	Password string `json:"password"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	DBname   string `json:"dbname"`
}

// initDB creates a new instance of DB
func InitDB() {
	configFile, err := os.Open("../dbconfig.json")
	if err != nil {
		log.Fatal("Error opening dbconfig.json:", err)
	}
	defer configFile.Close()

	var config Config
	jsonParser := json.NewDecoder(configFile)
	if err = jsonParser.Decode(&config); err != nil {
		log.Fatal("Error decoding dbconfig.json", err)
	}

	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		config.User, config.Password, config.Host, config.Port, config.DBname,
	)

	var connErr error
	Connection, connErr = sql.Open("postgres", connStr)
	if connErr != nil {
		log.Fatal(connErr)
	}
}
