package main

import (
	"fmt"
	"net/http"
	"os"
)

func getData(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hello world\n")
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/data", getData)

	serverEnv := os.Getenv("SERVER_ENV")

	if serverEnv == "DEV" {
		http.ListenAndServe(":8080", nil)
	} else if serverEnv == "PROD" {
		http.ListenAndServeTLS(
			":443",
			"/etc/letsencrypt/live/app.jurajmajerik.com/fullchain.pem",
			"/etc/letsencrypt/live/app.jurajmajerik.com/privkey.pem",
			nil,
		)
	}
}
