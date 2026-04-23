from flask import Blueprint
from controllers.bar_filter_controller import FilterController

filter_bp = Blueprint('filters', __name__)

@filter_bp.route('/cities', methods=['GET'])
def get_bars():
    return FilterController.get_cities()

@filter_bp.route('/stats', methods=['GET'])
def get_statistics():
    return FilterController.get_statistics()

@filter_bp.route('/arrondissement/<arrondissement>', methods=['GET'])
def get_bars_by_arrondissement(arrondissement):
    return FilterController.get_bars_by_arrondissement(arrondissement)