from fastapi import APIRouter
import numpy as np
import pandas as pd
from backend.app.utils.recommender import get_recommender

router = APIRouter(prefix="/api/dashboard", tags=["B2B Cosmetics Analytics"])

@router.get("/country-distribution")
def get_country_distribution():
    """
    Returns the distribution of cosmetic products by country of origin.
    Useful for rendering choropleth maps, bar charts, or bubble maps in B2B Dashboard.
    """
    rec = get_recommender()
    df = rec.df
    
    if df is None or df.empty:
        return []
        
    counts = df['Country_of_Origin'].value_counts()
    
    # Let's map country to coordinates (latitude, longitude) so the frontend can easily draw bubble maps
    coordinates = {
        "USA": {"lat": 37.0902, "lng": -95.7129},
        "South Korea": {"lat": 35.9078, "lng": 127.7669},
        "France": {"lat": 46.2276, "lng": 2.2137},
        "Japan": {"lat": 36.2048, "lng": 138.2529},
        "UK": {"lat": 55.3781, "lng": -3.4360},
        "Canada": {"lat": 56.1304, "lng": -106.3468},
        "Germany": {"lat": 51.1657, "lng": 10.4515},
        "Italy": {"lat": 41.8719, "lng": 12.5674},
        "Turkey": {"lat": 38.9637, "lng": 35.2433},
        "Australia": {"lat": -25.2744, "lng": 133.7751}
    }
    
    result = []
    for country, count in counts.items():
        coords = coordinates.get(country, {"lat": 0, "lng": 0})
        # Calculate average rating and price per country for extra B2B depth!
        country_df = df[df['Country_of_Origin'] == country]
        avg_price = round(float(country_df['Price'].mean()), 2)
        avg_rating = round(float(country_df['Rating'].mean()), 2)
        
        result.append({
            "country": country,
            "count": int(count),
            "lat": coords["lat"],
            "lng": coords["lng"],
            "avg_price": avg_price,
            "avg_rating": avg_rating
        })
        
    return result

@router.get("/price-rating-correlation")
def get_price_rating_correlation():
    """
    Returns individual product price and rating points for correlation charts.
    Includes Pearson correlation coefficient, trendline equations, and statistics.
    """
    rec = get_recommender()
    df = rec.df
    
    if df is None or df.empty:
        return {"points": [], "correlation": 0, "avg_price": 0, "avg_rating": 0}
        
    # Pick a sample of points to make the frontend chart snappy, or send all if it's manageable (500 is very small)
    points = []
    for idx, row in df.iterrows():
        points.append({
            "id": int(idx),
            "name": row['Name'],
            "brand": row['Brand'],
            "price": float(row['Price']),
            "rating": float(row['Rating']),
            "main_ingredient": row['Main_Ingredient']
        })
        
    # Calculate Pearson correlation
    correlation = float(df['Price'].corr(df['Rating']))
    
    # Calculate linear regression line parameters (y = mx + c)
    # y = Rating, x = Price
    x = df['Price'].values
    y = df['Rating'].values
    
    m = 0.0
    c = 4.0
    
    if len(x) > 1:
        A = np.vstack([x, np.ones(len(x))]).T
        m, c = np.linalg.lstsq(A, y, rcond=None)[0]
        
    # Average Stats
    avg_price = round(float(df['Price'].mean()), 2)
    avg_rating = round(float(df['Rating'].mean()), 2)
    
    return {
        "points": points,
        "correlation": round(correlation, 4),
        "avg_price": avg_price,
        "avg_rating": avg_rating,
        "slope": round(float(m), 6),
        "intercept": round(float(c), 4)
    }

@router.get("/top-ingredients")
def get_top_ingredients(limit: int = 15):
    """
    Returns the most frequently used ingredients, along with their average ratings and prices.
    Useful for rendering premium bar charts or word clouds in B2B Dashboard.
    """
    rec = get_recommender()
    df = rec.df
    
    if df is None or df.empty:
        return []
        
    counts = df['Main_Ingredient'].value_counts().head(limit)
    
    result = []
    for ing, count in counts.items():
        ing_df = df[df['Main_Ingredient'] == ing]
        avg_price = round(float(ing_df['Price'].mean()), 2)
        avg_rating = round(float(ing_df['Rating'].mean()), 2)
        
        result.append({
            "ingredient": ing,
            "count": int(count),
            "avg_price": avg_price,
            "avg_rating": avg_rating
        })
        
    return result
