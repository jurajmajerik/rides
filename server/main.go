package main

import (
	db "app/db"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

type Driver struct {
	Id         string `json:"id"`
	DriverId   string `json:"driverId"`
	Name       string `json:"name"`
	Status     string `json:"status"`
	Location   string `json:"location"`
	Path       string `json:"path"`
	PathIndex  int    `json:"pathIndex"`
	CustomerId string `json:"customerId"`
	CustomerName string `json:"customerName"`
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

func driversHandler(w http.ResponseWriter, req *http.Request) {
	rows, err := db.Connection.Query(`
		SELECT
			id,
			driver_id,
			name, 
			status, 
			location,
			path,
			path_index,
			customer_id,
			customer_name 
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
			&driver.CustomerName,
		)
		drivers = append(drivers, driver)
	}

	ridesBytes, _ := json.MarshalIndent(drivers, "", "\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(ridesBytes)
}

func customersHandler(w http.ResponseWriter, req *http.Request) {
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

func getGrafanaHandler() func(w http.ResponseWriter, r *http.Request) {
	grafanaURL, _ := url.Parse("http://" + os.Getenv("SERVER_IP") + ":3000")
	grafanaProxy := httputil.NewSingleHostReverseProxy(grafanaURL)

	return func(w http.ResponseWriter, r *http.Request) {
		r.URL.Host = grafanaURL.Host
		r.URL.Scheme = grafanaURL.Scheme
		r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))
		r.Header.Set("Host", r.URL.Host)
		r.Header.Set("Origin", "http://"+os.Getenv("SERVER_IP"))
		r.Host = grafanaURL.Host

		// Modify the incoming request URL to remove the "/grafana" prefix
		r.URL.Path = strings.TrimPrefix(r.URL.Path, "/grafana")

		grafanaProxy.ServeHTTP(w, r)
	}
}

func spaHandler(w http.ResponseWriter, r *http.Request) {
	staticPath := "../frontend/build"
	indexPath := "index.html"
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join(staticPath, path)

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join(staticPath, indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(staticPath)).ServeHTTP(w, r)
}

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}

	db.InitDB()
	defer db.Connection.Close()

	router := mux.NewRouter()

	router.HandleFunc("/api/drivers", driversHandler)
	router.HandleFunc("/api/customers", customersHandler)
	router.HandleFunc("/grafana/{subpath:.*}", getGrafanaHandler())
	router.PathPrefix("/").Handler(http.HandlerFunc(spaHandler))

	serverEnv := os.Getenv("SERVER_ENV")
	if serverEnv == "DEV" {
		srv := &http.Server{
			Handler:      router,
			Addr:         ":8080",
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		}

		log.Fatal(srv.ListenAndServe())
	} else if serverEnv == "PROD" {
		srv := &http.Server{
			Handler:      router,
			Addr:         ":443",
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		}

		log.Fatal(srv.ListenAndServeTLS(
			"/etc/letsencrypt/live/rides.jurajmajerik.com/fullchain.pem",
			"/etc/letsencrypt/live/rides.jurajmajerik.com/privkey.pem",
		))
	}
}
