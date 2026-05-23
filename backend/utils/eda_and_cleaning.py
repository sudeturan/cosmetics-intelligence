import os
import pandas as pd
import numpy as np

def clean_and_engineer_data():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    raw_path = os.path.join(base_dir, "data", "raw_beauty_products.csv")
    cleaned_path = os.path.join(base_dir, "data", "cleaned_beauty_products.csv")
    
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw data not found at {raw_path}. Run data_initializer.py first.")
        
    print(f"[INFO] Loading raw dataset from {raw_path}...")
    df = pd.read_csv(raw_path)
    
    # --- DYNAMIC SCHEMA DETECTION ---
    is_new_schema = "Product_Name" in df.columns or "Price_USD" in df.columns
    
    if is_new_schema:
        print("[INFO] New Kaggle cosmetics dataset schema detected. Executing dynamic mapping...")
        
        # 1. Rename core columns
        rename_map = {
            "Product_Name": "Name",
            "Price_USD": "Price"
        }
        df = df.rename(columns=rename_map)
        
        # 2. Map Target Audience from Gender_Target
        gender_map = {
            "Female": "Kadın",
            "Male": "Erkek",
            "Unisex": "Unisex"
        }
        if "Gender_Target" in df.columns:
            df["Target_Audience"] = df["Gender_Target"].map(gender_map).fillna("Unisex")
        else:
            df["Target_Audience"] = "Unisex"
            
        # 3. Handle Cruelty Free conversion to 0/1
        if "Cruelty_Free" in df.columns:
            df["Cruelty_Free"] = df["Cruelty_Free"].apply(lambda x: 1 if str(x).lower() in ["true", "1", "1.0", "yes"] else 0)
        else:
            df["Cruelty_Free"] = 0
            
        # 4. Generate standard binary skin type flags from the single 'Skin_Type' column
        skin_types = ['Combination', 'Dry', 'Normal', 'Oily', 'Sensitive']
        for st in skin_types:
            df[st] = 0
            
        if "Skin_Type" in df.columns:
            def expand_skin_types(row):
                val = str(row["Skin_Type"]).strip().title()
                if val in skin_types:
                    row[val] = 1
                return row
            df = df.apply(expand_skin_types, axis=1)
            
        # 5. Synthesize 'Ingredients' for TF-IDF since new Kaggle dataset doesn't have it
        if "Ingredients" not in df.columns:
            def synthesize_ingredients(row):
                main = row.get("Main_Ingredient", "Botanical Extracts")
                cat = row.get("Category", "Skin Care")
                brand = row.get("Brand", "Cosmetics")
                # Create a rich ingredients string with the main ingredient, brand and category words
                return f"Water, Glycerin, Butylene Glycol, {main}, Centella Asiatica Extract, {cat} elements, {brand} proprietary formula, Tocopherol, Phenoxyethanol, Allantoin"
            df["Ingredients"] = df.apply(synthesize_ingredients, axis=1)
            
    else:
        print("[INFO] Standard Sephora-based dataset schema detected.")
        
        # Clean up skin type binary flags to ensure they are integers 0 or 1
        skin_types = ['Combination', 'Dry', 'Normal', 'Oily', 'Sensitive']
        for st in skin_types:
            if st in df.columns:
                df[st] = pd.to_numeric(df[st], errors='coerce').fillna(0).astype(int).clip(0, 1)
            else:
                df[st] = 0
                
        # Fill in Category if missing
        if "Category" not in df.columns:
            df["Category"] = "Skincare"
            
    # --- COMMON CLEANING & ENHANCEMENT ---
    # Handle missing values globally
    df['Brand'] = df['Brand'].fillna('Unknown Brand')
    df['Name'] = df['Name'].fillna('Generic Cosmetic Product')
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce').fillna(25).astype(int)
    df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(4.0).clip(0.0, 5.0)
    df['Ingredients'] = df['Ingredients'].fillna('Water')
    
    # 1. Map Country of Origin if missing or blank
    brand_country_map = {
        "La Roche-Posay": "France", "CeraVe": "USA", "The Ordinary": "Canada",
        "Laneige": "South Korea", "Kiehl's": "USA", "Drunk Elephant": "USA",
        "Paula's Choice": "USA", "COSRX": "South Korea", "Innisfree": "South Korea",
        "Estée Lauder": "USA", "Clinique": "USA", "The Inkey List": "UK",
        "Shiseido": "Japan", "Sulwhasoo": "South Korea", "Fenty Skin": "USA"
    }
    countries_list = ["France", "South Korea", "USA", "Japan", "Germany", "Canada", "UK", "Australia", "Turkey", "Italy"]
    
    if "Country_of_Origin" not in df.columns:
        def get_country(brand):
            if brand in brand_country_map:
                return brand_country_map[brand]
            hash_val = abs(hash(brand)) % len(countries_list)
            return countries_list[hash_val]
        df['Country_of_Origin'] = df['Brand'].apply(get_country)
    else:
        df['Country_of_Origin'] = df['Country_of_Origin'].fillna('USA')
        
    # 2. Extract Main Ingredient if missing or blank
    known_ingredients = [
        "Retinol", "Niacinamide", "Salicylic Acid", "Hyaluronic Acid", 
        "Vitamin C", "Shea Butter", "Aloe Vera", "Centella Asiatica", 
        "Snail Mucin", "Glycolic Acid", "Ceramides", "Tea Tree Oil", 
        "Green Tea Extract", "Peptides", "Squalane", "Lavender Essential Oil",
        "Benzoyl Peroxide", "Caffeine", "Oatmeal"
    ]
    
    if "Main_Ingredient" not in df.columns:
        def extract_main_ingredient(row):
            ingredients_str = str(row['Ingredients']).lower()
            for ing in known_ingredients:
                if ing.lower() in ingredients_str:
                    return ing
            parts = [p.strip() for p in ingredients_str.split(',')]
            if len(parts) > 1:
                val = parts[1].title()
                if len(val) < 25:
                    return val
            return "Botanical Extracts"
        df['Main_Ingredient'] = df.apply(extract_main_ingredient, axis=1)
    else:
        df['Main_Ingredient'] = df['Main_Ingredient'].fillna('Botanical Extracts')

    # Save cleaned and engineered dataset
    df.to_csv(cleaned_path, index=False, encoding='utf-8')
    print(f"[SUCCESS] Cleaned and feature engineered dataset saved with {len(df)} rows at {cleaned_path}")
    print("\nSummary of Engineered Features:")
    print(f"- Total rows: {len(df)}")
    print(f"- Unique Brands: {df['Brand'].nunique()}")
    print(f"- Unique Main Ingredients: {df['Main_Ingredient'].nunique()}")
    print(f"- Country distribution:\n{df['Country_of_Origin'].value_counts().head(5)}")
    print(f"- Target Audience distribution:\n{df['Target_Audience'].value_counts()}")
    print(f"- Cruelty-Free ratio: {df['Cruelty_Free'].mean():.2%}")

if __name__ == "__main__":
    clean_and_engineer_data()
