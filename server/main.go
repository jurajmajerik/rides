package main

import (
	db "app/db"
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type Driver struct {
	Id       string `json:"id"`
	DriverId string `json:"driverId"`
	Name        string `json:"name"`
	Status 		  string `json:"status"`
	Location string `json:"location"`
	Path     string `json:"path"`
	PathIndex int `json:"pathIndex"`
	CustomerId string `json:"customerId"`
}

type Customer struct {
	Id          string `json:"id"`
	CustomerId  string `json:"customerId"`
	Name        string `json:"name"`
	Active      bool   `json:"active"`
	Location    string `json:"location"`
	Destination string `json:"destination"`
	DriverId    string `json:"driverId"`
}

func getDrivers(w http.ResponseWriter, req *http.Request) {
	rows, err := db.Connection.Query(`
		SELECT
			id,
			driver_id,
			name, 
			status, 
			location,
			path,
			path_index,
			customer_id 
		FROM drivers
		`,
	)
	if err != nil {
		http.Error(w, "Failed to get drivers: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var drivers []Driver

	for rows.Next() {
		var driver Driver
		rows.Scan(
			&driver.Id,
			&driver.DriverId,
			&driver.Name,
			&driver.Status,
			&driver.Location,
			&driver.Path,
			&driver.PathIndex,
			&driver.CustomerId,
		)
		drivers = append(drivers, driver)
	}

	ridesBytes, _ := json.MarshalIndent(drivers, "", "\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(ridesBytes)
}

func getCustomers(w http.ResponseWriter, req *http.Request) {
	rows, err := db.Connection.Query(`
		SELECT 
			id, 
			customer_id, 
			name, 
			active, 
			location, 
			destination, 
			driver_id 
		FROM customers WHERE
		active = true AND 
		driver_id IS NULL AND 
		(location IS NOT NULL AND location != 'null') 
		`,
	)
	if err != nil {
		http.Error(w, "Failed to get customers: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var customers []Customer

	for rows.Next() {
		var customer Customer
		rows.Scan(
			&customer.Id,
			&customer.CustomerId,
			&customer.Name,
			&customer.Active,
			&customer.Location,
			&customer.Destination,
			&customer.DriverId,
		)
		customers = append(customers, customer)
	}

	ridesBytes, _ := json.MarshalIndent(customers, "", "\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(ridesBytes)
}

func main() {
	db.InitDB()
	defer db.Connection.Close()

	http.Handle("/", http.FileServer(http.Dir("../frontend/build")))
	http.HandleFunc("/drivers", getDrivers)
	http.HandleFunc("/customers", getCustomers)

	serverEnv := os.Getenv("SERVER_ENV")

	if serverEnv == "DEV" {
		log.Fatal(http.ListenAndServe(":8080", nil))
	} else if serverEnv == "PROD" {
		log.Fatal(
			http.ListenAndServeTLS(
				":443",
				"/etc/letsencrypt/live/rides.jurajmajerik.com/fullchain.pem",
				"/etc/letsencrypt/live/rides.jurajmajerik.com/privkey.pem",
				nil,
			),
		)
	}
}
