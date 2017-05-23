export class InterventionPlanData {
  public data: any[] = [
    {
      id : '613723a0-f980-419d-9814-50f5d396eaa2',
      planNumber: 'BLSK-28893-ABC',
      planName: 'Nom du plan pour cette adresse',
      idLaneTransversal: '',
      idPictureSitePlan: 'a3852cc7-4354-47c8-8917-7c861fe87f68',
      otherInformation: '',
      createdOn: '',
      revisedOn: '',
      approvedOn: '',
      isActive: true,
      fireHydrants: [
        {
          'id': '1',
          'idInterventionPlan': '613723a0-f980-419d-9814-50f5d396eaa2',
          'number': 'ABC-123',
          'color': 'forestgreen',
          'idFireHydrantType': '13c781ac-7084-4d23-baef-cd2ee6a3801d',
          'capacity': 10,
          'idUnitOfMeasure': 'fe6c7ce9-93c8-4787-9f89-98dde45be7f9',
          'addressType': 2, // 1: address, 2: intersection, 3: lat/long, 4: other.
          'idLocationType': '',
          'civicNumber': '',
          'idLane': '44d2cf8d-ffea-498f-a9f3-8228d2a64d2e',
          'idLaneIntersection': '7cf70bca-f171-44ab-8084-dfa4c31c58b2',
          'latitude': null,
          'longitude': null,
          'locationDetails': '',
          'isActive': true
        },
        {
          'id': '2',
          'idInterventionPlan': '613723a0-f980-419d-9814-50f5d396eaa2',
          'number': 'ABC-456',
          'color': 'red',
          'idFireHydrantType': '13c781ac-7084-4d23-baef-cd2ee6a3801d',
          'capacity': 12,
          'idUnitOfMeasure': 'fe6c7ce9-93c8-4787-9f89-98dde45be7f9',
          'addressType': 1, // 1: address, 2: intersection, 3: lat/long, 4: other.
          'idLocationType': 'CAUCA26052009-3',
          'civicNumber': '666',
          'idLane': '44d2cf8d-ffea-498f-a9f3-8228d2a64d2e',
          'idLaneIntersection': '',
          'latitude': null,
          'longitude': null,
          'locationDetails': '',
          'isActive': true
        },
        {
          'id': '3',
          'idInterventionPlan': '613723a0-f980-419d-9814-50f5d396eaa2',
          'number': 'DEF-123',
          'color': 'yellow',
          'idFireHydrantType': '13c781ac-7084-4d23-baef-cd2ee6a3801d',
          'capacity': 10,
          'idUnitOfMeasure': 'fe6c7ce9-93c8-4787-9f89-98dde45be7f9',
          'addressType': 3, // 1: address, 2: intersection, 3: lat/long, 4: other.
          'idLocationType': '',
          'civicNumber': '',
          'idLane': '',
          'idLaneIntersection': '',
          'latitude': 46.200830,
          'longitude': -70.621622,
          'locationDetails': '',
          'isActive': true
        },
        {
          'id': '4',
          'idInterventionPlan': '613723a0-f980-419d-9814-50f5d396eaa2',
          'number': 'DEF-456',
          'color': 'white',
          'idFireHydrantType': '13c781ac-7084-4d23-baef-cd2ee6a3801d',
          'capacity': 10,
          'idUnitOfMeasure': 'fe6c7ce9-93c8-4787-9f89-98dde45be7f9',
          'addressType': 4, // 1: address, 2: intersection, 3: lat/long, 4: other.
          'idLocationType': '',
          'civicNumber': '',
          'idLane': '',
          'idLaneIntersection': '',
          'latitude': null,
          'longitude': null,
          'locationDetails': 'Ici ou ailleurs.',
          'isActive': true
        }
      ],
      buildings: [
        {
          id: '1',
          idInterventionPlan: '613723a0-f980-419d-9814-50f5d396eaa2',
          idBuilding: '29bb0912-e4ce-45f0-8c26-511806d25b50',
          isParent: true,
          alias: 'Résidence',
          address: '8865, BOUL. LACROIX',
          idImage: '048de54d-3bcf-11e7-bf23-5254004f3384',
          idLane: '8f21cafd-c188-4f62-8fe6-e4321a866ca8',
          idRiskLevel: 'd7c8116b-f337-402e-a997-13236f277a4d',
          matricule: '98354671000000000'
        }
      ]
    },
    {
      id : 'c8954079-2d75-44df-a2f1-55fdf581f30a',
      planNumber: 'BLSK-28800-BDE',
      planName: 'Nom du plan pour cette adresse',
      idLaneTransversal: '',
      idPictureSitePlan: 'a3852cc7-4354-47c8-8917-7c861fe87f68',
      otherInformation: '',
      createdOn: '',
      revisedOn: '',
      approvedOn: '',
      isActive: true,
      fireHydrants: [
        {
          'id': 'ABC1',
          'idInterventionPlan': '613723a0-f980-419d-9814-50f5d396eaa3',
          'number': 'DEF-123',
          'color': 'forestgreen',
          'idFireHydrantType': '13c781ac-7084-4d23-baef-cd2ee6a3801d',
          'capacity': 10,
          'idUnitOfMeasure': 'fe6c7ce9-93c8-4787-9f89-98dde45be7f9',
          'addressType': 2, // 1: address, 2: intersection, 3: lat/long, 4: other.
          'idLocationType': '',
          'civicNumber': '',
          'idLane': '44d2cf8d-ffea-498f-a9f3-8228d2a64d2e',
          'idLaneIntersection': '7cf70bca-f171-44ab-8084-dfa4c31c58b2',
          'latitude': null,
          'longitude': null,
          'locationDetails': '',
          'isActive': true
        },
        {
          'id': 'ABC2',
          'idInterventionPlan': '613723a0-f980-419d-9814-50f5d396eaa3',
          'number': 'DEF-456',
          'color': 'red',
          'idFireHydrantType': '13c781ac-7084-4d23-baef-cd2ee6a3801d',
          'capacity': 12,
          'idUnitOfMeasure': 'fe6c7ce9-93c8-4787-9f89-98dde45be7f9',
          'addressType': 1, // 1: address, 2: intersection, 3: lat/long, 4: other.
          'idLocationType': 'CAUCA26052009-3',
          'civicNumber': '666',
          'idLane': '44d2cf8d-ffea-498f-a9f3-8228d2a64d2e',
          'idLaneIntersection': '',
          'latitude': null,
          'longitude': null,
          'locationDetails': '',
          'isActive': true
        }
      ],
      buildings: [
        {
          id: '2',
          idInterventionPlan: '613723a0-f980-419d-9814-50f5d396eaa3',
          idBuilding: '29bb0912-e4ce-45f0-8c26-511806d25b55',
          isParent: true,
          alias: 'Bâtiment principal',
          address: '8780, Boulevard Lacroix',
          idImage: '048de54d-3bcf-11e7-bf23-5254004f3384',
          idLane: '8f21cafd-c188-4f62-8fe6-e4321a866ca8',
          idRiskLevel: 'd251f211-ea12-44c5-9f9c-081e80841128',
          matricule: '98354671000000000'
        },
        {
          id: '3',
          idInterventionPlan: '613723a0-f980-419d-9814-50f5d396eaa3',
          idBuilding: '29bb0912-e4ce-45f0-8c26-511806d25b56',
          isParent: true,
          alias: 'Grange',
          address: '8780, Boulevard Lacroix',
          idImage: '63a9c6f4-3bd6-11e7-bf23-5254004f3384',
          idLane: '8f21cafd-c188-4f62-8fe6-e4321a866ca8',
          idRiskLevel: 'd251f211-ea12-44c5-9f9c-081e80841128',
          matricule: '98354671000000000'
        },
        {
          id: '4',
          idInterventionPlan: '613723a0-f980-419d-9814-50f5d396eaa3',
          idBuilding: '29bb0912-e4ce-45f0-8c26-511806d25b57',
          isParent: true,
          alias: 'Hangar',
          address: '8780, Boulevard Lacroix',
          idImage: '54a2bc24-3bd6-11e7-bf23-5254004f3384',
          idLane: '8f21cafd-c188-4f62-8fe6-e4321a866ca8',
          idRiskLevel: 'd251f211-ea12-44c5-9f9c-081e80841128',
          matricule: '98354671000000000'
        }
      ]
    }
  ];
}

// 613723a0-f980-419d-9814-50f5d396eaa2
// c8954079-2d75-44df-a2f1-55fdf581f30a
