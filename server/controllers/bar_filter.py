from flask import request, jsonify
from services.bar_service import BarService

class BarController:

    
    @staticmethod
    def get_bars():

        try:
            name = request.args.get('name')
            city = request.args.get('city')
            
            bars = BarService.get_all_bars(name=name, city=city)
            bars_data = [bar.to_dict() for bar in bars]
            
            return jsonify(bars_data), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500
    
    @staticmethod
    def get_bar_detail(bar_id):

        try:
            bar = BarService.get_bar_by_id(bar_id)
            
            if not bar:
                return jsonify({'message': 'Bar not found'}), 404
            
            return jsonify(bar.to_dict()), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500
    
    @staticmethod
    def search_bars():

        try:
            data = request.get_json()
            term = data.get('term', '')
            
            if not term:
                return jsonify({'message': 'Search term required'}), 400
            
            bars = BarService.search_bars(term)
            bars_data = [bar.to_dict() for bar in bars]
            
            return jsonify(bars_data), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500
    
    @staticmethod
    def get_bars_by_city(city):

        try:
            bars = BarService.get_bars_by_city(city)
            bars_data = [bar.to_dict() for bar in bars]
            
            return jsonify(bars_data), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500