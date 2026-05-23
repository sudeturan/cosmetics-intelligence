import os
import csv
import random

def generate_mock_data():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    os.makedirs(data_dir, exist_ok=True)
    raw_csv_path = os.path.join(data_dir, "raw_beauty_products.csv")
    
    if os.path.exists(raw_csv_path):
        print(f"[INFO] Raw data already exists at {raw_csv_path}. Skipping mock generation.")
        return

    print("[INFO] Creating realistic mock Kaggle cosmetic dataset...")

    brands = [
        "La Roche-Posay", "CeraVe", "The Ordinary", "Laneige", "Kiehl's",
        "Drunk Elephant", "Paula's Choice", "COSRX", "Innisfree", "Estée Lauder",
        "Clinique", "The Inkey List", "Shiseido", "Sulwhasoo", "Fenty Skin"
    ]

    products = [
        {"name": "Hyaluronic Acid 2% + B5", "category": "Serum", "main_ing": "Hyaluronic Acid", "base_price": 9},
        {"name": "Niacinamide 10% + Zinc 1%", "category": "Serum", "main_ing": "Niacinamide", "base_price": 8},
        {"name": "Salicylic Acid 2% Solution", "category": "Exfoliator", "main_ing": "Salicylic Acid", "base_price": 10},
        {"name": "Retinol 0.5% in Squalane", "category": "Serum", "main_ing": "Retinol", "base_price": 12},
        {"name": "Glycolic Acid 7% Toning Solution", "category": "Toner", "main_ing": "Glycolic Acid", "base_price": 14},
        {"name": "CeraVe Moisturizing Cream", "category": "Moisturizer", "main_ing": "Ceramides", "base_price": 18},
        {"name": "CeraVe Hydrating Facial Cleanser", "category": "Cleanser", "main_ing": "Ceramides", "base_price": 16},
        {"name": "CeraVe Foaming Facial Cleanser", "category": "Cleanser", "main_ing": "Ceramides", "base_price": 16},
        {"name": "Effaclar Duo Dual Action Acne Treatment", "category": "Treatment", "main_ing": "Benzoyl Peroxide", "base_price": 22},
        {"name": "Toleriane Double Repair Face Moisturizer", "category": "Moisturizer", "main_ing": "Ceramides", "base_price": 23},
        {"name": "Anthelios Melt-in Milk Sunscreen SPF 60", "category": "Sunscreen", "main_ing": "Antioxidants", "base_price": 36},
        {"name": "Water Sleeping Mask", "category": "Mask", "main_ing": "Hydro Ionized Mineral Water", "base_price": 32},
        {"name": "Lip Sleeping Mask", "category": "Mask", "main_ing": "Shea Butter", "base_price": 24},
        {"name": "Ultra Facial Cream", "category": "Moisturizer", "main_ing": "Squalane", "base_price": 38},
        {"name": "Midnight Recovery Concentrate", "category": "Oil", "main_ing": "Lavender Essential Oil", "base_price": 56},
        {"name": "Facial Fuel Energizing Moisture Treatment", "category": "Moisturizer", "main_ing": "Caffeine", "base_price": 35},
        {"name": "C-Firma Fresh Day Serum", "category": "Serum", "main_ing": "Vitamin C", "base_price": 78},
        {"name": "Protini Polypeptide Cream", "category": "Moisturizer", "main_ing": "Peptides", "base_price": 68},
        {"name": "B-Hydra Intensive Hydration Serum", "category": "Serum", "main_ing": "Vitamin B5", "base_price": 48},
        {"name": "Skin Perfecting 2% BHA Liquid Exfoliant", "category": "Exfoliator", "main_ing": "Salicylic Acid", "base_price": 34},
        {"name": "Clinical 1% Retinol Treatment", "category": "Treatment", "main_ing": "Retinol", "base_price": 62},
        {"name": "Advanced Snail 96 Mucin Power Essence", "category": "Essence", "main_ing": "Snail Mucin", "base_price": 21},
        {"name": "Advanced Snail 92 All In One Cream", "category": "Moisturizer", "main_ing": "Snail Mucin", "base_price": 24},
        {"name": "Low pH Good Morning Gel Cleanser", "category": "Cleanser", "main_ing": "Tea Tree Oil", "base_price": 14},
        {"name": "Green Tea Seed Serum", "category": "Serum", "main_ing": "Green Tea Extract", "base_price": 28},
        {"name": "Super Volcanic Pore Clay Mask 2X", "category": "Mask", "main_ing": "Volcanic Ash", "base_price": 16},
        {"name": "Advanced Night Repair Synchronized Multi-Recovery Complex", "category": "Serum", "main_ing": "Hyaluronic Acid", "base_price": 85},
        {"name": "DayWear Multi-Protection Anti-Oxidant 24H-Moisture Creme", "category": "Moisturizer", "main_ing": "Antioxidants", "base_price": 58},
        {"name": "Dramatically Different Moisturizing Gel", "category": "Moisturizer", "main_ing": "Hyaluronic Acid", "base_price": 32.5},
        {"name": "Moisture Surge 100H Auto-Replenishing Hydrator", "category": "Moisturizer", "main_ing": "Aloe Vera", "base_price": 46},
        {"name": "Take The Day Off Cleansing Balm", "category": "Cleanser", "main_ing": "Safflower Seed Oil", "base_price": 38},
        {"name": "Oat Cleansing Balm", "category": "Cleanser", "main_ing": "Colloidal Oatmeal", "base_price": 12},
        {"name": "Retinol Serum", "category": "Serum", "main_ing": "Retinol", "base_price": 13},
        {"name": "Treatment Softener Enriched", "category": "Toner", "main_ing": "Hyaluronic Acid", "base_price": 55},
        {"name": "Ultimune Power Infusing Concentrate", "category": "Serum", "main_ing": "Reishi Mushroom", "base_price": 80},
        {"name": "First Care Activating Serum", "category": "Serum", "main_ing": "Korean Herbs Extract", "base_price": 89},
        {"name": "Concentrated Ginseng Renewing Cream", "category": "Moisturizer", "main_ing": "Ginseng", "base_price": 240},
        {"name": "Fat Water Niacinamide Pore-Refining Toner Serum", "category": "Toner", "main_ing": "Niacinamide", "base_price": 34},
        {"name": "Hydra Vizor Invisible Moisturizer Broad Spectrum SPF 30 Sunscreen", "category": "Moisturizer", "main_ing": "Niacinamide", "base_price": 38}
    ]

    # Additional ingredients to mix in randomly to simulate standard Sephora ingredients list
    extra_ingredients = [
        "Water", "Glycerin", "Butylene Glycol", "Phenoxyethanol", "Dimethicone",
        "Disodium EDTA", "Xanthan Gum", "Sodium Hydroxide", "Ethylhexylglycerin",
        "Tocopherol (Vitamin E)", "Citric Acid", "Allantoin", "Panthenol",
        "Caprylic/Capric Triglyceride", "Squalane", "Centella Asiatica Extract",
        "Licorice Root Extract", "Tea Tree Extract", "Aloe Barbadensis Leaf Juice"
    ]

    fieldnames = ["Brand", "Name", "Price", "Rating", "Ingredients", "Combination", "Dry", "Normal", "Oily", "Sensitive"]

    random.seed(42)  # For deterministic output
    rows = []

    # Let's generate about 500 rows
    for i in range(500):
        prod_base = random.choice(products)
        brand = random.choice(brands)
        
        # Add brand context to product name to make it unique
        name = f"{prod_base['name']} - {brand}"
        if i % 3 == 0:
            name = f"{prod_base['name']} ({random.choice(['Premium', 'Advanced', 'Daily', 'Smoothing', 'Hydrating'])})"
        
        # Calculate pricing with variance based on brand tier
        brand_multiplier = 1.0
        if brand in ["Shiseido", "Sulwhasoo", "Estée Lauder"]:
            brand_multiplier = 1.8 + random.uniform(-0.2, 0.4)
        elif brand in ["The Ordinary", "The Inkey List", "COSRX", "Innisfree"]:
            brand_multiplier = 0.6 + random.uniform(-0.1, 0.2)
        else:
            brand_multiplier = 1.0 + random.uniform(-0.15, 0.3)
            
        price = round(prod_base["base_price"] * brand_multiplier, 1)
        if price < 5.0:
            price = 5.0
        price = int(price)  # Convert to standard integers for cleaner display

        # Generate a rating (mostly high, typical Sephora range: 3.5 to 4.9)
        rating = round(random.choices(
            [4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.0, 3.8, 3.5],
            weights=[15, 20, 25, 15, 10, 5, 4, 3, 2, 1],
            k=1
        )[0] + random.uniform(-0.05, 0.05), 1)
        
        # Generate ingredients list
        # Ensure the main ingredient is first or second
        prod_ingredients = [prod_base["main_ing"]]
        num_ingredients = random.randint(8, 20)
        chosen_extras = random.sample(extra_ingredients, min(num_ingredients, len(extra_ingredients)))
        
        # Put Water first 80% of the time, then main ingredient, then the rest
        if "Water" in chosen_extras:
            chosen_extras.remove("Water")
        
        if random.random() < 0.8:
            ingredients_list = ["Water", prod_base["main_ing"]] + chosen_extras
        else:
            ingredients_list = [prod_base["main_ing"]] + chosen_extras
            
        ingredients = ", ".join(ingredients_list)

        # Decide skin types
        # Certain categories / ingredients match certain skin types
        combination = 1
        dry = 0
        normal = 1
        oily = 0
        sensitive = 0

        main_ing = prod_base["main_ing"].lower()
        cat = prod_base["category"].lower()

        if "dry" in cat or "moisturizer" in cat or "shea butter" in main_ing or "hyaluronic" in main_ing or "squalane" in main_ing:
            dry = 1
            combination = 1
            normal = 1
            sensitive = random.choice([0, 1])
        if "oily" in cat or "salicylic" in main_ing or "cleanser" in cat or "tea tree" in main_ing or "niacinamide" in main_ing:
            oily = 1
            combination = 1
            normal = 1
        if "sensitive" in main_ing or "ceramides" in main_ing or "aloe" in main_ing or "colloidal" in main_ing:
            sensitive = 1
            normal = 1
            dry = 1
        
        # Add random variations
        if random.random() < 0.15:
            combination = random.choice([0, 1])
            dry = random.choice([0, 1])
            normal = random.choice([0, 1])
            oily = random.choice([0, 1])
            sensitive = random.choice([0, 1])
            
        # Ensure at least one skin type is active
        if not (combination or dry or normal or oily or sensitive):
            combination = 1
            normal = 1

        rows.append({
            "Brand": brand,
            "Name": name,
            "Price": price,
            "Rating": rating,
            "Ingredients": ingredients,
            "Combination": combination,
            "Dry": dry,
            "Normal": normal,
            "Oily": oily,
            "Sensitive": sensitive
        })

    with open(raw_csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[SUCCESS] Mock Kaggle cosmetic dataset created with {len(rows)} products at {raw_csv_path}.")

if __name__ == "__main__":
    generate_mock_data()
