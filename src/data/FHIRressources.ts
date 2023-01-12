export const PROM =
{
    'resourceType': 'QuestionnaireResponse',
    'id': '637288805f83d970f5ba8c53', 
    'encounter': {'reference': 'Encounter/id3'}, 

    'identifier': { 
        'value': '1'
    },
    'status': 'in-progress',
    'subject': {
        'reference': 'Patient/ID', 
        'display': 'Lukas Dev'
    },
    'item': [ 
        {
            'linkId': '1',
            'definition': 'Global01',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '2',
            'definition': 'Global02',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '3',
            'definition': 'Global03',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '4',
            'definition': 'Global04',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '5',
            'definition': 'Global05',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '6',
            'definition': 'Global09r',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '7',
            'definition': 'Global06',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '8',
            'definition': 'Global10r',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '9',
            'definition': 'Global08r',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        },
        {
            'linkId': '10',
            'definition': 'Global07r',
            'answer': [
                {
                    'valueInteger': 1
                }
            ]
        }
    ]
}

export const ENCOUNTER=
{
  'resourceType': 'Encounter',
  'status': 'finished',
  'id': 'id3',
  'episodeOfCare': [
    {
      'display': '',
      'reference': 'EpisodeOfCare/id4'
    }
  ],
  'subject': {
    'display': '',
    'reference': 'Patient/id2'
  }}

  export const EPISODE_OF_CARE=
{
  'resourceType': 'EpisodeOfCare',
  'status': 'planned',
  'patient': {
    'display': '',
    'reference': 'Patient/id2'
  },
  'id': 'id1',
  'identifier': [
    {
      'value': 'caseID',
      'assigner': {
        'display': '',
        'reference': 'Organization/id3'
      }
    }
  ]
}
export const PATIENT = {
    'resourceType': 'Patient',
    'id': '',
    'identifier': [
        {
            'value': 'Patienten ID',
            'assigner': {
              'display': '',
              'reference': 'Organization/id2'
            }}
    ],
    'name': [
        {
            'family': '',
            'given': [
                ''
            ]
        }
    ],
    'gender': '',
    'address': [
        {
            'country': 'Switzerland'
        }
    ],
    'birthDate': 'YYYY',
    'telecom': [
        {
          'system': 'email',
          'value': '',

        }
      ],
}
