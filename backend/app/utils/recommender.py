import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class CosmeticRecommender:
    def __init__(self):
        self.df = None
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None
        self.load_data()

    def load_data(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        cleaned_path = os.path.join(base_dir, "data", "cleaned_beauty_products.csv")
        
        if not os.path.exists(cleaned_path):
            # Fallback if cleaning wasn't run yet
            raw_path = os.path.join(base_dir, "data", "raw_beauty_products.csv")
            if os.path.exists(raw_path):
                print("[WARNING] Cleaned data not found, loading raw data instead.")
                self.df = pd.read_csv(raw_path)
            else:
                raise FileNotFoundError("No cosmetic dataset available in data folder.")
        else:
            self.df = pd.read_csv(cleaned_path)
            
        # Fit TF-IDF on ingredients for content-based matching
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['Ingredients'].fillna(''))
        print(f"[INFO] Recommender initialized with {len(self.df)} products.")

    def recommend(self, skin_type=None, target_audience=None, cruelty_free=None, max_price=None, query=None, limit=3):
        """
        AI-driven multi-criteria recommendation engine.
        Filters products based on hard filters (skin type, budget, audience),
        then ranks them using a hybrid score (TF-IDF similarity, rating, cruelty-free, price optimization).
        """
        if self.df is None or self.df.empty:
            return []

        filtered_df = self.df.copy()
        
        # --- 1. Hard Filtering ---
        # Skin type filter (Dry, Oily, Sensitive, Combination, Normal)
        if skin_type:
            # Capitalize to match column name
            col_name = skin_type.title()
            if col_name in filtered_df.columns:
                filtered_df = filtered_df[filtered_df[col_name] == 1]
                
        # Target Audience filter
        if target_audience and target_audience != "Hepsi":
            # If user selects Kadın or Erkek, we also show Unisex
            if target_audience in ["Kadın", "Erkek"]:
                filtered_df = filtered_df[filtered_df['Target_Audience'].isin([target_audience, "Unisex"])]
            else:
                filtered_df = filtered_df[filtered_df['Target_Audience'] == target_audience]
                
        # Cruelty-Free filter
        if cruelty_free is not None and cruelty_free:
            filtered_df = filtered_df[filtered_df['Cruelty_Free'] == 1]
            
        # Budget / Price filter
        if max_price is not None:
            filtered_df = filtered_df[filtered_df['Price'] <= max_price]
            
        if filtered_df.empty:
            return []
            
        # --- 2. Ranking / Scoring ---
        # Calculate TF-IDF similarity score if text query is provided
        sim_scores = np.zeros(len(filtered_df))
        
        if query:
            query_vec = self.vectorizer.transform([query])
            # We need indices of filtered_df in original df to get TF-IDF row
            orig_indices = filtered_df.index.tolist()
            if orig_indices:
                filtered_tfidf = self.tfidf_matrix[orig_indices]
                sim_scores = cosine_similarity(query_vec, filtered_tfidf).flatten()
        
        # Calculate a robust hybrid rank score
        # Formula elements:
        # - Similarity Score (0.0 to 1.0) -> Weight: 3.0 (high priority if query exists)
        # - Rating (0.0 to 5.0 scaled to 0-1) -> Weight: 2.0
        # - Price Score (cheaper products within budget get slightly higher score) -> Weight: 0.5
        # - Cruelty-free Bonus -> Weight: 0.5
        
        ratings = filtered_df['Rating'].values / 5.0
        prices = filtered_df['Price'].values
        max_filtered_price = prices.max() if len(prices) > 0 else 1.0
        price_scores = 1.0 - (prices / (max_filtered_price + 1))
        cruelty_bonuses = filtered_df['Cruelty_Free'].values * 0.5
        
        # Base score on ratings, prices, and cruelty free
        rank_scores = (ratings * 2.0) + (price_scores * 0.5) + cruelty_bonuses
        
        # Add text similarity score if query exists
        if query:
            rank_scores += sim_scores * 4.0
            
        filtered_df['Match_Score'] = rank_scores
        # Sort descending by Match_Score
        recommended = filtered_df.sort_values(by='Match_Score', ascending=False)
        
        # Format the output items
        output = []
        for idx, row in recommended.head(limit).iterrows():
            output.append({
                "id": int(idx),
                "brand": row['Brand'],
                "name": row['Name'],
                "price": float(row['Price']),
                "rating": float(row['Rating']),
                "ingredients": row['Ingredients'],
                "main_ingredient": row['Main_Ingredient'],
                "country": row['Country_of_Origin'],
                "cruelty_free": bool(row['Cruelty_Free']),
                "target_audience": row['Target_Audience'],
                "match_score": round(float(row['Match_Score']), 2),
                "skin_types": {
                    "dry": bool(row.get('Dry', 0)),
                    "oily": bool(row.get('Oily', 0)),
                    "sensitive": bool(row.get('Sensitive', 0)),
                    "combination": bool(row.get('Combination', 0)),
                    "normal": bool(row.get('Normal', 0))
                }
            })
            
        return output

# Singleton instance
recommender_engine = None

def get_recommender():
    global recommender_engine
    if recommender_engine is None:
        recommender_engine = CosmeticRecommender()
    return recommender_engine
