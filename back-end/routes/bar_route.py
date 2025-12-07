from flask import Blueprint
from controllers.bar_filter import BarController

bar_bp = Blueprint('bars', __name__)


@bar_bp.route('/bars', methods=['GET'])
def get_bars():
    return BarController.get_bars()


@bar_bp.route('/bars/<int:bar_id>', methods=['GET'])
def get_bar_detail(bar_id):
    return BarController.get_bar_detail(bar_id)


@bar_bp.route('/bars/search', methods=['POST'])
def search_bars():
    return BarController.search_bars()


@bar_bp.route('/bars/city/<city>', methods=['GET'])
def get_bars_by_city(city):
    return BarController.get_bars_by_city(city)


