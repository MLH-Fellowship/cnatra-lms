# python imports
from flask_restful import Resource

# project imports
from models.grade_sheet_maneuvers import GradeSheetManeuverModel
from models.grade_sheets import GradeSheetModel

class GradeSheet(Resource):

    def get(self, grade_sheet_id):

        # query for grade_sheet
        grade_sheet_model = GradeSheetModel.objects(grade_sheet_id=grade_sheet_id).first()
        grade_sheet = grade_sheet_model.as_dict()

        # format student and instructor data
        user_fields = ['user_id', 'first_name', 'last_name']
        grade_sheet['student'] = {k:grade_sheet['student'][k] for k in user_fields}
        grade_sheet['instructor'] = {k:grade_sheet['instructor'][k] for k in user_fields}

        # get grade_sheet grade_sheet_maneuvers
        grade_sheet['grade_sheet_maneuvers'] = [grade_sheet_maneuver.as_dict() for grade_sheet_maneuver in GradeSheetManeuverModel.objects(grade_sheet=grade_sheet_model)]

        # return grade_sheet or 404 (not found)
        if grade_sheet:
            return {'grade_sheet': grade_sheet}
        return {'message': 'Grade sheet not found'}, 404