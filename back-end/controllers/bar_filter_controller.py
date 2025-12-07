from flask import jsonify
from services.bar_filter_service import FilterService

class FilterController:

    
    @staticmethod
    def get_cities():

        try:
            cities = FilterService.get_all_cities()
            return jsonify(cities), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500
    
    
    @staticmethod
    def get_statistics():

        try:
            stats = FilterService.get_statistics()
            return jsonify(stats), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500


    @staticmethod
    def get_bars_by_arrondissement(arrondissement):

        try:
            bars = FilterService.get_bars_by_arrondissement(arrondissement)
            return jsonify(bars), 200
        except Exception as error:
            return jsonify({'message': str(error)}), 500