# Cosmetics Intelligence (Aesthetique.) - Cosmetic Data Analytics and Smart Recommendation Platform

This project is a full-stack web application that processes raw cosmetic and skincare datasets through advanced data cleaning, analysis, and feature engineering pipelines, presenting two distinct sectoral concepts under a unified modern interface.

The application is built on two primary concepts:
1. Concept A: "Beauty and Care Assistant" (B2C / Consumer-Oriented): A minimalist web application where users filter products based on their skin types, budget, and gender preferences, receiving personalized product recommendations powered by an underlying machine learning content similarity algorithm.
2. Concept B: "Cosmetics Industry Analytics Dashboard" (B2B / Executive Dashboard): An administrative dashboard where brand managers track price-to-rating correlations, trending active ingredients, and global manufacturing distributions over an interactive real-world geographical map.

---

## Technical Stack

* **Backend:** Python, FastAPI, Pandas, Scikit-Learn, Numpy, Uvicorn, Python-Dotenv
* **Frontend:** React.js, Vite, TailwindCSS v4, Leaflet.js, Recharts, Lucide-React, Axios

---

## Data Processing, Cleaning, and Feature Engineering (Data Pipelines)

The core data pipeline driving the platform consists of two main stages:

### 1. Dynamic Schema Mapping and Data Cleaning
A flexible cleaning mechanism has been established to seamlessly integrate varying incoming dataset structures (e.g., standard Sephora datasets or raw Kaggle beauty datasets).
* **Missing Value Management:** Missing values in Brand, Product Name, and Ingredients columns are filled with sensible default values; missing prices are imputed using median values, and customer satisfaction rating scores are clipped between 0.0 and 5.0.
* **Schema Standardization:** Raw Kaggle dataset columns like "Product_Name" and "Price_USD" are dynamically renamed to "Name" and "Price" respectively to ensure backend data uniformity.

### 2. Advanced Feature Engineering
To supply the B2C and B2B visual interfaces, high-value analytical dimensions are engineered from the raw dataset before exporting the clean data to `cleaned_beauty_products.csv`:
* **Binary Skin Type Matrix Expansion:** Raw single-column text values for skin types (Dry, Oily, Sensitive, Combination, Normal) are expanded into 5 distinct binary columns (0 or 1 values) to seamlessly feed the multi-faceted B2C sidebar filter checkboxes.
* **Active Ingredient (Main Ingredient) Extraction:** Product ingredient lists are programmatically scanned to isolate high-value active ingredients like Retinol, Niacinamide, Salicylic Acid, Hyaluronic Acid, Vitamin C, Ceramides, Aloe Vera, and Shea Butter. In datasets where ingredient lists are missing, highly realistic formulas are synthesized dynamically based on brand tier and category.
* **Target Audience Classification:** Gender target data ("Gender_Target") is mapped to uniform "Female","Male" and "Unisex" labels to align with standard cosmetic market segments.
* **Geographical Coordinate Mapping:** Country of Origin names are enriched with absolute latitude and longitude coordinates to enable precise positioning of pulsing data points on the B2B world map.

---

## AI Recommendation Engine

The smart matching system driving the B2C "Best for you" recommendation carousel is a hybrid algorithm combining hard filtering parameters with a multi-criteria weighted scoring model.

* **Text Vectorization (TF-IDF):** Product ingredient lists and primary actives are converted into mathematical vectors using Scikit-Learn's `TfidfVectorizer` class.
* **Cosine Similarity:** The user's input keyword or active ingredient search term is vectorized and compared against the ingredient vectors of existing products using cosine similarity metrics.
* **Multi-Criteria Ranking Score:** Screened products that pass the initial hard filters (price, skin type) are ranked using the following custom scoring formula:
  `Score = (Cosine Similarity Score * 4.0) + (Customer Rating * 0.4) + (Cruelty-Free Bonus * 0.5) + (Budget Optimization Score * 0.1)`
  This ensures that the user is presented with the 3 most compatible products, ranked by satisfaction ratings, value for money, animal-cruelty-free status, and ingredient match, displayed with a calculated compatibility percentage.

---

## Running the Application Locally

The project is configured to run locally out-of-the-box. Follow these steps to spin up the servers.

### 1. Backend Setup
Install the required Python packages and launch the FastAPI server:
```bash
# From the project root directory
pip install -r backend/requirements.txt

# Run the FastAPI server using Uvicorn
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Once the server is running, you can explore the interactive API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Frontend Setup
Install npm dependencies and launch the Vite development server:
```bash
# Change directory to the frontend folder
cd frontend

# Install required node modules
npm install

# Build and start the development server
npm run dev
```
You can now access the web application in your browser by visiting [http://localhost:5173/](http://localhost:5173/).

---

## Integrating Your Own Kaggle Dataset

To replace the default dataset with your actual Kaggle cosmetic CSV dataset:
1. Save your custom Kaggle dataset as `raw_beauty_products.csv` inside the `backend/data/` directory.
2. In your terminal, run the cleaning and feature engineering pipeline:
   ```bash
   python backend/utils/eda_and_cleaning.py
   ```
3. Once the execution completes, `cleaned_beauty_products.csv` will be updated.
4. The background FastAPI server will automatically load the new dataset into memory in under 1 second. Simply refresh your browser tab at [http://localhost:5173/](http://localhost:5173/) to see your actual products populated across charts, maps, and recommendations!
