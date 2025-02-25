import requests
from typing import List, Dict, Any

class RedditService:
  def __init__(self):
    self.base_url = "https://www.reddit.com"

  def get_trends(self, subreddit: str = "popular", limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch trending posts from Reddit"""
    headers = {
      "User-Agent": "Mozilla/5.0 Mini-Trends-Dashboard/1.0"
    }

    url = f"{self.base_url}/r/{subreddit}/hot.json?limit={limit}"

    try:
      response = requests.get(url, headers=headers)
      response.raise_for_status()

      data = response.json()
      trends = []

      for post in data["data"]["children"]:
        post_data = post["data"]
        trends.append({
          "id": post_data["id"],
          "title": post_data["title"],
          "score": post_data["score"],
          "comments": post_data["num_comments"],
          "url": post_data["url"],
          "created": post_data["created_utc"],
          "subreddit": post_data["subreddit"]
        })

      return trends
    except Exception as e:
      print(f"Error fetching Reddit trends: {e}")
      return []
    
# Create a singleton instance
reddit_service = RedditService()