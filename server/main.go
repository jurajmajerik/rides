package main

import (
	db "app/db"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"os"
	"fmt"

	"github.com/joho/godotenv"
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

func getGrafanaProxy() *httputil.ReverseProxy {
	baseURL := "http://host.docker.internal"
	if os.Getenv("SERVER_ENV") == "PROD" {
		baseURL = "http://" + os.Getenv("SERVER_IP")
	}
	grafanaURL, _ := url.Parse(baseURL + ":3000")
	fmt.Println("Grafana URL: " + grafanaURL.String())
	grafanaProxy := httputil.NewSingleHostReverseProxy(grafanaURL)
	return grafanaProxy
}

func getPrometheusProxy() *httputil.ReverseProxy {
	baseURL := "http://host.docker.internal"
	if os.Getenv("SERVER_ENV") == "PROD" {
		baseURL = "http://" + os.Getenv("SERVER_IP")
	}
	prometheusURL, _ := url.Parse(baseURL + ":9090")
	fmt.Println("Prometheus URL: " + prometheusURL.String())
	prometheusProxy := httputil.NewSingleHostReverseProxy(prometheusURL)
	return prometheusProxy
}

func main() {
	err := godotenv.Load("../.env")
  if err != nil {
    log.Fatal(err)
  }

	db.InitDB()
	defer db.Connection.Close()

	grafanaProxy := getGrafanaProxy()
	prometheusProxy := getPrometheusProxy()
	
	http.Handle("/", http.FileServer(http.Dir("../frontend/build")))
	http.HandleFunc("/drivers", getDrivers)
	http.HandleFunc("/customers", getCustomers)
	
	http.HandleFunc("/grafana/", func(w http.ResponseWriter, r *http.Request) {
		// Modify the incoming request URL to remove the "/grafana" prefix.
    r.URL.Path = strings.TrimPrefix(r.URL.Path, "/grafana")
    grafanaProxy.ServeHTTP(w, r)
	})

	http.HandleFunc("/prometheus/", func(w http.ResponseWriter, r *http.Request) {
		// Modify the incoming request URL to remove the "/grafana" prefix.
    // r.URL.Path = strings.TrimPrefix(r.URL.Path, "/prometheus")
		// don't overwrite if asking for /metrics!
    prometheusProxy.ServeHTTP(w, r)
	})
	
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
