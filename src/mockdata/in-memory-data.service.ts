import { InMemoryDbService } from 'angular-in-memory-web-api';
import { SurveyQuestionData } from './survey-question-data';
import { RiskLevelData } from './risk-level-data';
import { InspectionData } from './inspection-data';
import { InspectionQuestionData } from './inspection-question-data';
import { LaneData } from './lane-data';
import { BuildingContactData } from './building-contact-data';
import {BuildingHazardousMaterialData} from './building-hazardous-material-data';
import {UnitOfMeasureData} from './unit-of-measure-data';
import {InterventionPlanFireHydrantData} from './intervention-plan-fire-hydrant-data';
import {HazardousMaterialData} from './hazardous-material-data';
import {FireHydrantTypeData} from './fire-hydrant-type-data';
import {LocationTypeData} from './location-type-data';
import {PersonRequiringAssistanceTypeData} from './person-requiring-assistance-type-data';
import {BuildingPersonRequiringAssistanceData} from './building-person-requiring-assistance-data';
import {PictureData} from './picture-data';
import {InterventionPlanCourseData} from './intervention-plan-course-data';
import {FirestationData} from './firestation-data';
import {InterventionPlanCourseLaneData} from './intervention-plan-course-lane-data';
import {InterventionPlantBuildingData} from './intervention-plan-building-data';
import {ConstructionTypeData} from './construction-type-data';
import {AlarmPanelTypeData} from './alarm-panel-type-data';
import {InterventionPlanData} from './intervention-plan-data';
import {BuildingData} from './building-data';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const surveys = [
    {
      'createdOn': '2017/03/21 11:39:03',
      'name': '',
      'idLanguageContentName': '8e22388f-b82e-4ea9-a8e2-f57f5a86d5cc',
      'idSurvey': '2ad92470-c65b-498b-a2c7-792dda7f139b',
      'isActive': true,
      'surveyType': 'residential',
      'idBuilding' : ''
    },
    {
      'createdOn': '2017/03/21 11:39:03',
      'name': '',
      'idLanguageContentName': '8e22388f-b82e-4ea9-a8e2-f57f5a86d5cc',
      'idSurvey': '2ad92470-c65b-498b-a2c7-792dda7f139b',
      'isActive': true,
      'surveyType': 'residential',
      'idBuilding' : ''
      },
    {
      'createdOn': '2017/03/21 11:39:03',
      'name': '',
      'idLanguageContentName': '8e22388f-b82e-4ea9-a8e2-f57f5a86d5cc',
      'idSurvey': '2ad92470-c65b-498b-a2c7-792dda7f139b',
      'isActive': true,
      'surveyType': 'residential',
      'idBuilding' : ''
      }
    ];

    const surveyQuestions = new SurveyQuestionData().data;
    const riskLevel = new RiskLevelData().data;
    const inspection = new InspectionData().data;
    const inspectionQuestion = new InspectionQuestionData().data;
    const lanes = new LaneData().data;
    const buildingContacts =  new BuildingContactData().data;
    const hazardousMaterials = new HazardousMaterialData().data.slice(0, 50);
    const buildingHazardousMaterials = new BuildingHazardousMaterialData().data;
    const unitsOfMeasure = new UnitOfMeasureData().data;
    const interventionPlanFireHydrants = new InterventionPlanFireHydrantData().data;
    const fireHydrantTypes = new FireHydrantTypeData().data;
    const locationTypes = new LocationTypeData().data;
    const pnapTypes = new PersonRequiringAssistanceTypeData().data;
    const buildingPnaps = new BuildingPersonRequiringAssistanceData().data;
    const pictures = new PictureData().data;
    const courses = new InterventionPlanCourseData().data;
    const courseLanes = new InterventionPlanCourseLaneData().data;
    const firestation = new FirestationData().data;
    const interventionPlanBuildings = new InterventionPlantBuildingData().data;
    const interventionPlans = new InterventionPlanData().data;
    const constructionTypes = new ConstructionTypeData().data;
    const alarmPanelTypes = new AlarmPanelTypeData().data;
    const building = new BuildingData().data;

    return {
      'surveys': surveys,
      'lanes': lanes,
      'survey-question': surveyQuestions,
      'risklevel': riskLevel,
      'inspection': inspection,
      'inspection-question': inspectionQuestion,
      'building-contacts': buildingContacts,
      'hazardous-material': hazardousMaterials,
      'building-hazardous-material': buildingHazardousMaterials,
      'unit-of-measure': unitsOfMeasure,
      'intervention-plan-fire-hydrant': interventionPlanFireHydrants,
      'fire-hydrant-type': fireHydrantTypes,
      'location-type': locationTypes,
      'person-requiring-assistance-type': pnapTypes,
      'building-person-requiring-assistance': buildingPnaps,
      'picture': pictures,
      'intervention-plan-course': courses,
      'intervention-plan-course-lane': courseLanes,
      'firestation': firestation,
      'intervention-plan-building': interventionPlanBuildings,
      'intervention-plan': interventionPlans,
      'alarm-panel-type': alarmPanelTypes,
      'construction-type': constructionTypes,
      'building': building,
    };
  }
}
