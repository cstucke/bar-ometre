from models.bar import Bar

def get_all_bars():
    return Bar.find_all()

def get_bar_by_id(Bar_id):
    return Bar.find_by_id(Bar_id)

def get_bar_by_name(name):
    return Bar.fin_by_name(name)
