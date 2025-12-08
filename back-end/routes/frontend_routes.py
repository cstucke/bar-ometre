from flask import Blueprint, render_template, request
import requests
import folium

frontend_bp = Blueprint('frontend', __name__)
API_BASE = 'http://localhost:5000/api'

def create_map(bars):

    map_obj = folium.Map(
        location=[48.8566, 2.3522],
        zoom_start=12,
        tiles='OpenStreetMap'
    )
    

    for bar in bars:

        if not isinstance(bar, dict):
            continue
            
        lat = bar.get('latitude')
        lng = bar.get('longitude')
        
        if not lat or not lng:
            continue
            
        name = bar.get('name', 'Unknown')
        street = bar.get('street', '')
        house_number = bar.get('house_number', '')
        postcode = bar.get('postcode', '')
        city = bar.get('city', '')
        phone = bar.get('phone', '')
        website = bar.get('website', '')
        opening_hours = bar.get('opening_hours', '')
        
        popup_text = f"""
            <b>{name}</b><br>
            {street} {house_number}<br>
            {postcode} {city}<br>
            {f"Phone: {phone}<br>" if phone else ''}
            {f"<a href='{website}' target='_blank'>Website</a><br>" if website else ''}
            {f"Hours: {opening_hours}" if opening_hours else ''}
        """
        
        folium.CircleMarker(
            location=[lat, lng],
            radius=6,
            popup=popup_text,
            color='#667eea',
            fill=True,
            fillColor='#667eea',
            fillOpacity=0.8,
            weight=2
        ).add_to(map_obj)
    
    return map_obj._repr_html_()

@frontend_bp.route('/', methods=['GET'])
def index():

    try:

        response = requests.get(f'{API_BASE}/bars')
        data = response.json()

        bars = data.get('data', []) if isinstance(data, dict) else data
        
        map_html = create_map(bars)
        
        return render_template('map.html', map=map_html, bars=bars)
    except Exception as e:
        return f"Error: {str(e)}", 500

@frontend_bp.route('/bars/search', methods=['POST'])
def search():

    try:
        name = request.form.get('name', '')
        city = request.form.get('city', '')
        arrondissement = request.form.get('arrondissement', '')


        if arrondissement:
            
            response = requests.get(f'{API_BASE}/arrondissement/{arrondissement}')
            api_data = response.json()
            bars = api_data if isinstance(api_data, list) else api_data.get('data', [])
            
        else:

            params = {}
            
            if name:
                params['name'] = name
                
            if city:
                params['city'] = city
            
            response = requests.get(f'{API_BASE}/bars', params=params)
            api_data = response.json()
            bars = api_data if isinstance(api_data, list) else api_data.get('data', [])
        

        bars_dicts = []
        for bar in bars:
            if isinstance(bar, list):
                bars_dicts.append({
                    'id': bar[0],
                    'name': bar[1],
                    'street': bar[2],
                    'house_number': bar[3],
                    'postcode': bar[4],
                    'city': bar[5],
                    'phone': bar[6],
                    'website': bar[7],
                    'opening_hours': bar[8],
                    'latitude': bar[9],
                    'longitude': bar[10]
                })
            else:
                bars_dicts.append(bar)

        map_html = create_map(bars_dicts)
        
        return render_template('map.html', map=map_html, bars=bars_dicts)
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return f"Error: {str(e)}", 500