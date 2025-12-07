from db.connect_db import Database
from models.bar import Bar

class BarService:

    
    @staticmethod
    def get_all_bars(name=None, city=None):

        query = "SELECT * FROM bars WHERE 1=1"
        params = []
        
        if name:
            query += " AND LOWER(name) LIKE LOWER(%s)"
            params.append(f"%{name}%")
        
        if city:
            query += " AND LOWER(city) LIKE LOWER(%s)"
            params.append(f"%{city}%")
        
        query += " LIMIT 500"
        
        results = Database.query(query, tuple(params) if params else None)
        
        if not results:
            return []
        
        bars = [Bar(*row) for row in results]
        return bars
    
    @staticmethod
    def get_bar_by_id(bar_id):

        query = "SELECT * FROM bars WHERE id = %s"
        result = Database.query(query, (bar_id,), one=True)
        
        if not result:
            return None
        
        bar = Bar(*result)
        return bar
    
    @staticmethod
    def search_bars(search_term):

        query = "SELECT * FROM bars WHERE LOWER(name) LIKE LOWER(%s) LIMIT 500"
        results = Database.query(query, (f"%{search_term}%",))
        
        if not results:
            return []
        
        bars = [Bar(*row) for row in results]
        return bars
    
    @staticmethod
    def get_bars_by_city(city):

        query = "SELECT * FROM bars WHERE LOWER(city) LIKE LOWER(%s) LIMIT 500"
        results = Database.query(query, (f"%{city}%",))
        
        if not results:
            return []
        
        bars = [Bar(*row) for row in results]
        return bars