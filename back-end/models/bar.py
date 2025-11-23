class Bar:
    
    def __init__(self, id, name, street=None, house_number=None, postcode=None, city="Paris", phone=None, website=None, opening_hours=None, latitude=None, longtitude=None):
        
        self.id = id
        self.name = name
        self. street = street
        self.house_number = house_number
        self.postcode = postcode
        self.city = city
        self.phone = phone
        self.website = website
        self.opening_hours = opening_hours
        self.latitude = latitude
        self.longtitude = longtitude
        
    
    def to_dict(self):
        
        return {
            'id': self.id,
            'name': self.name,
            'street': self.street,
            'house_number': self.house_number,
            'postcode': self.postcode,
            'city': self.city,
            'phone': self.phone,
            'website': self.website,
            'opening_hours': self.opening_hours,
            'latitude': self.latitude,
            'longitude': self.longitude
        }