from typing import Optional
from fastapi import APIRouter, Query
from backend.app.utils.recommender import get_recommender

router = APIRouter(prefix="/api/assistant", tags=["B2C Beauty Assistant"])

@router.get("/products")
def get_products(
    skin_type: Optional[str] = Query(None, description="Skin type filter: dry, oily, sensitive, combination, normal"),
    target_audience: Optional[str] = Query(None, description="Target audience: Kadın, Erkek, Unisex, Hepsi"),
    cruelty_free: Optional[bool] = Query(None, description="Filter for cruelty-free products"),
    max_price: Optional[float] = Query(None, description="Maximum budget price"),
    query: Optional[str] = Query(None, description="Search term in ingredients or product name"),
    skip: int = 0,
    limit: int = 20
):
    """
    Returns filtered products based on user criteria. Useful for the B2C product grid.
    """
    rec = get_recommender()
    # To get all filtered items for the grid, we recommend with a large limit
    # The recommender already filters and ranks.
    all_recommendations = rec.recommend(
        skin_type=skin_type,
        target_audience=target_audience,
        cruelty_free=cruelty_free,
        max_price=max_price,
        query=query,
        limit=1000  # High limit to fetch all matching
    )
    
    # Slice for pagination
    sliced = all_recommendations[skip : skip + limit]
    
    return {
        "total": len(all_recommendations),
        "skip": skip,
        "limit": limit,
        "products": sliced
    }

@router.get("/recommendations")
def get_top_recommendations(
    skin_type: Optional[str] = Query(None, description="Skin type filter: dry, oily, sensitive, combination, normal"),
    target_audience: Optional[str] = Query(None, description="Target audience: Kadın, Erkek, Unisex, Hepsi"),
    cruelty_free: Optional[bool] = Query(None, description="Filter for cruelty-free products"),
    max_price: Optional[float] = Query(None, description="Maximum budget price"),
    query: Optional[str] = Query(None, description="Search term in ingredients or product name"),
    limit: int = 3
):
    """
    Returns top N recommended products for the "Sizin İçin En İyiler" Carousel.
    Uses AI ranking (scoring + similarity).
    """
    rec = get_recommender()
    recommendations = rec.recommend(
        skin_type=skin_type,
        target_audience=target_audience,
        cruelty_free=cruelty_free,
        max_price=max_price,
        query=query,
        limit=limit
    )
    return recommendations
