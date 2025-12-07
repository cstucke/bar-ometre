from db.connect_db import Database

class FilterService:

    
    @staticmethod
    def get_all_cities():

        query = "SELECT DISTINCT city FROM bars WHERE city IS NOT NULL ORDER BY city"
        results = Database.query(query)
        
        if not results:
            return []
        
        cities = [row[0] for row in results]
        return cities
    
    
    @staticmethod
    def get_statistics():

        total_bars = Database.query("SELECT COUNT(*) FROM bars", one=True)[0]
        total_cities = Database.query("SELECT COUNT(DISTINCT city) FROM bars WHERE city IS NOT NULL", one=True)[0]
        bars_with_coords = Database.query("SELECT COUNT(*) FROM bars WHERE latitude IS NOT NULL AND longitude IS NOT NULL", one=True)[0]
        
        return {
            'total_bars': total_bars,
            'total_cities': total_cities,
            'bars_with_coordinates': bars_with_coords
        }
        
        
    @staticmethod
    def get_bars_by_arrondissement(arrondissement):

        query = "SELECT * FROM bars WHERE postcode LIKE %s LIMIT 500"
        results = Database.query(query, (f"750{arrondissement}%",))
        return results if results else []