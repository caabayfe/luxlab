import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'aiux-acl|experience:luxlab|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: '040f35ad641545fc99a3e2c8af21ff90'
                    }
                    'aiux-acl|x-everi-luxlab-briefing-page|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: '7c36262f1b2f441d8d1c1b3ca98cf3b5'
                    }
                    'aiux-acl|x-everi-luxlab-home-page|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: '48ec5cf559984eca839737fa7bd0054a'
                    }
                    'aiux-acl|x-everi-luxlab-patterns-page|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: '181b2ebe68214dcc8c5edcd9545a3ce9'
                    }
                    'aiux-acl|x-everi-luxlab-replay-detail-page|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: 'c74490f361a04251a630a45978008cab'
                    }
                    'aiux-acl|x-everi-luxlab-replay-page|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: 'ddd62c2670104823bb08ae956afb4673'
                    }
                    'aiux-acl|x-everi-luxlab-usage-page|read|allow_if|x_everi_luxlab.user': {
                        table: 'sys_security_acl'
                        id: 'beccc07d8e664cb58cc6370dd7ecb9de'
                    }
                    'aiux-color-swatch|luxlab': {
                        table: 'sys_aix_color_swatch'
                        id: 'c9037666bd32ad5efba402be1a227004'
                        deleted: true
                    }
                    'aiux-dependency|document-title.js': {
                        table: 'sys_aix_dependency'
                        id: '0625ebcdf225d7c6dc266a9f3e008e87'
                    }
                    'aiux-dependency|format.js': {
                        table: 'sys_aix_dependency'
                        id: '99a937a682ac6e5f80bf9c4d49a833db'
                    }
                    'aiux-dependency|luxlab-agent-run.js': {
                        table: 'sys_aix_dependency'
                        id: '5e288d2b28b63e009b1884d80ed1bc25'
                    }
                    'aiux-dependency|luxlab-time.js': {
                        table: 'sys_aix_dependency'
                        id: 'c008481f193445d8b7ed9498beb463d8'
                    }
                    'aiux-experience-page-rel|x-everi-luxlab-briefing-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '1d4469bfb79b25b460a5d9ce8c0412a5'
                    }
                    'aiux-experience-page-rel|x-everi-luxlab-home-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '3b5c8257547e5f3fd57711921e4b1cda'
                    }
                    'aiux-experience-page-rel|x-everi-luxlab-patterns-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '73060528a59d04c604da5d1cb365bfad'
                    }
                    'aiux-experience-page-rel|x-everi-luxlab-replay-detail-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '991b30144d42955208751897c296b02a'
                    }
                    'aiux-experience-page-rel|x-everi-luxlab-replay-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: 'cd3fccf4b3e49c48363d5d8a103fae04'
                    }
                    'aiux-experience-page-rel|x-everi-luxlab-usage-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: 'e6bbcaf2bdddfadc0e48fcf56c8e0a97'
                    }
                    'aiux-experience-prop|appTailwindCss': {
                        table: 'sys_aix_experience_properties'
                        id: '7f5d9f884c951154b59361fceeb6f982'
                    }
                    'aiux-experience|luxlab': {
                        table: 'sys_aix_experience'
                        id: '9e7a6ff9681f697535d73523623f0def'
                    }
                    'aiux-layout-widget|lifecycle': {
                        table: 'sys_aix_widget'
                        id: '81df539ed41b8b754fa78a7c8c00834a'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-briefing-page|document-title.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '869c20dd822e7732e0f698983b3d5ccf'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-briefing-page|format.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '3550adf0e79ac89812eb75e6c4cfd32b'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-briefing-page|luxlab-agent-run.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '2409e51ddfb9df37978461636970bfe9'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-briefing-page|luxlab-time.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '6eb7d350e73bc542b9dd40fe58070b6f'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-home-page|document-title.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '4448428d01634eec44c5de8ad55ebb19'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-home-page|format.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'ec0d4fceeae65474d7af027c0e13e8d5'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-patterns-page|document-title.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'd50e207bfa91de0210b09765a7031705'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-patterns-page|format.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'ea8a6af0a6f0ea692348aa4beb3ac74a'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-patterns-page|luxlab-agent-run.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '6cae1e991fd2c7dc38dfa1dc0b3f330d'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-patterns-page|luxlab-time.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '3b68750edcce0162e7554ce821a57cf6'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-detail-page|document-title.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'b1a9ca50b847cf49d55619aa2c4fff41'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-detail-page|format.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '95658c58d3393e4aa44b4c61a52b5f8c'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-detail-page|luxlab-agent-run.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '26d8a5b5ab23f31000616039d8a83e82'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-detail-page|luxlab-time.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '64e7e34a6105c5cc08081b7858a87417'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-page|document-title.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '86c0b443e13fe142487d279ae2670603'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-page|format.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: '032b24dfdae767cb1d1e57cfaac2ec1c'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-replay-page|luxlab-time.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'ce21ca2d2436a7ed2b1399cc48f9e67e'
                    }
                    'aiux-m2m-widget-dep|x-everi-luxlab-usage-page|document-title.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'd563d2612e20641ac921e431fe67ac47'
                    }
                    'aiux-page-widget|x-everi-luxlab-briefing-page': {
                        table: 'sys_aix_widget'
                        id: '77274f8a742b5396551299bc7a4b98fd'
                    }
                    'aiux-page-widget|x-everi-luxlab-home-page': {
                        table: 'sys_aix_widget'
                        id: 'f70d65196b9d207d5a2760812f866daa'
                    }
                    'aiux-page-widget|x-everi-luxlab-patterns-page': {
                        table: 'sys_aix_widget'
                        id: '6eac465ffce697e0cf95989c7f71ff15'
                    }
                    'aiux-page-widget|x-everi-luxlab-replay-detail-page': {
                        table: 'sys_aix_widget'
                        id: '8b97e5f49edd05586c9ade4a5ee57bb7'
                    }
                    'aiux-page-widget|x-everi-luxlab-replay-page': {
                        table: 'sys_aix_widget'
                        id: '3eb1a679ea09ac12a40b1a05f2de9111'
                    }
                    'aiux-page-widget|x-everi-luxlab-usage-page': {
                        table: 'sys_aix_widget'
                        id: 'f6acc483e68e9c57f1d7817f433531e3'
                    }
                    'aiux-page|x-everi-luxlab-briefing-page': {
                        table: 'sys_aix_page'
                        id: '97562b2304ff3d8411799d04e851065a'
                    }
                    'aiux-page|x-everi-luxlab-home-page': {
                        table: 'sys_aix_page'
                        id: '03618f05ddf1f3064a10ad47fbd4c7cb'
                    }
                    'aiux-page|x-everi-luxlab-patterns-page': {
                        table: 'sys_aix_page'
                        id: '26a7675ab0443c74bedc522b1792868b'
                    }
                    'aiux-page|x-everi-luxlab-replay-detail-page': {
                        table: 'sys_aix_page'
                        id: 'ca937cd04350532e4d8215e3d4b64a08'
                    }
                    'aiux-page|x-everi-luxlab-replay-page': {
                        table: 'sys_aix_page'
                        id: '917854efc75f773d3efbdc31c8e43935'
                    }
                    'aiux-page|x-everi-luxlab-usage-page': {
                        table: 'sys_aix_page'
                        id: 'c27e11de9ccde1d080c1e337112ff1fe'
                    }
                    'aiux-project|x_everi_luxlab': {
                        table: 'sys_aix_project'
                        id: '1999a76ccd3090eedefa0d99fc1fda2d'
                    }
                    'aiux-theme|luxlab': {
                        table: 'sys_aix_theme'
                        id: '936c48722b49e703017dd5ea535338a3'
                    }
                    'assists-per-agent-run-property': {
                        table: 'sys_properties'
                        id: '844429ae28fc4e9c9a68d615564ae8f0'
                        deleted: true
                    }
                    'assists-per-skill-run-property': {
                        table: 'sys_properties'
                        id: 'df5878dca7ae48838d461dae9b41138b'
                        deleted: true
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '60135a3bfff84e1a921c9ef84a46266d'
                    }
                    'briefing-api': {
                        table: 'sys_ws_definition'
                        id: 'beed88b082e94d398d5e9274814b2fa0'
                    }
                    'briefing-api-run': {
                        table: 'sys_ws_operation'
                        id: 'c12f9bfbcb16409eb9283a0b0639d263'
                    }
                    'briefing-api-tools': {
                        table: 'sys_ws_operation'
                        id: '7db3905037f04670b3e31b1597d897f8'
                    }
                    'briefing-api-trace': {
                        table: 'sys_ws_operation'
                        id: '3ae35386eedb4d5c84db5f011a1e9419'
                    }
                    'briefing-api-v1': {
                        table: 'sys_ws_version'
                        id: '0ea250c7da134ead8ec9da7f3f85841f'
                    }
                    'briefing-run-read-acl': {
                        table: 'sys_security_acl'
                        id: '8353b59b0a37412181517c523f86845d'
                    }
                    'cockpit-api': {
                        table: 'sys_ws_definition'
                        id: '8378f6cf95b24fea9add07d8862ce5b4'
                    }
                    'cockpit-api-acl': {
                        table: 'sys_security_acl'
                        id: '043664e62bed42eba1dfa1d637ab365b'
                    }
                    'cockpit-api-attention': {
                        table: 'sys_ws_operation'
                        id: '677dd28ff63a431a8ba569e671e17577'
                    }
                    'cockpit-api-attention-page': {
                        table: 'sys_ws_query_parameter'
                        id: '7d15a438fca044dc93ea28bdbb476e87'
                    }
                    'cockpit-api-attention-size': {
                        table: 'sys_ws_query_parameter'
                        id: '07811fe5c25e4639a89997a08ce0e0f0'
                    }
                    'cockpit-api-overview': {
                        table: 'sys_ws_operation'
                        id: '45b697339d9d42d29c89d6de01745324'
                    }
                    'cockpit-api-v1': {
                        table: 'sys_ws_version'
                        id: '7377f76c414d4df3ac50ef2529d27f8f'
                    }
                    follow_up_advisor_incident_number_input: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '9ff63d7ee3fb4df084252d87e5d39d3e'
                    }
                    follow_up_advisor_prompt_v1: {
                        table: 'sys_generative_ai_config'
                        id: 'b36cd5df9e074da4ad7d99c4625414e0'
                    }
                    follow_up_advisor_skill: {
                        table: 'sys_one_extend_capability'
                        id: '190360efeb2f47efb449f012b48a5baf'
                    }
                    follow_up_advisor_skill__output_error: {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'd1d00b633cb14c9594b7a522501ad532'
                    }
                    follow_up_advisor_skill__output_errorcode: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '503b1a31e5fc4e0a82733d707ceb3f63'
                    }
                    follow_up_advisor_skill__output_provider: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '179066006cbb4dff83a889ce92007264'
                    }
                    follow_up_advisor_skill__output_response: {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'e8f4cf4aa83e45fabb872b7470c75195'
                    }
                    follow_up_advisor_skill__output_status: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '892c52389cb749e68b1ebd853dc5df37'
                    }
                    follow_up_advisor_uiaction: {
                        table: 'sys_ui_action'
                        id: 'cb265c90e273440c9add9938f90dbfc4'
                    }
                    follow_up_advisor_user_access: {
                        table: 'sys_security_acl'
                        id: '37c034ac38eb402da01e7900ccf7717b'
                    }
                    incident_review_writer_incident_number_input: {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'e10fc4fd09674ebbb431c1fa0c9bb9c7'
                    }
                    incident_review_writer_prompt_v1: {
                        table: 'sys_generative_ai_config'
                        id: 'ab72e875ca864345b1102aea4821d4e1'
                    }
                    incident_review_writer_skill: {
                        table: 'sys_one_extend_capability'
                        id: '27c932b1fbbe47659e6b0bdea0f45737'
                    }
                    incident_review_writer_skill__output_error: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '206bf2ec77214a6e867e1e7b60d1b19e'
                    }
                    incident_review_writer_skill__output_errorcode: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '3501d00b37b14bcfb1357064ab160799'
                    }
                    incident_review_writer_skill__output_provider: {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'ec7c6caacab943abb91b780905ab14d4'
                    }
                    incident_review_writer_skill__output_response: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '8ba1ea1ed1cd4707b2a1b5ff462ee265'
                    }
                    incident_review_writer_skill__output_status: {
                        table: 'sys_one_extend_definition_attribute'
                        id: '33ce9c6c17d243debcd94f73a506d7e5'
                    }
                    incident_review_writer_uiaction: {
                        table: 'sys_ui_action'
                        id: '723843cb8b3d4a0eb47d6e566bafa681'
                    }
                    incident_review_writer_user_access: {
                        table: 'sys_security_acl'
                        id: '5c84bfc1231e4b70b12f1ec42b070ee5'
                    }
                    'knowledge-base-property': {
                        table: 'sys_properties'
                        id: '2f1cd377a9844758b6e10e7c37536af8'
                    }
                    'luxlab-agent-runtime-si': {
                        table: 'sys_script_include'
                        id: '82a7b0d3406f4f2eb0f0d4c11ce824f3'
                    }
                    'luxlab-menu': {
                        table: 'sys_app_application'
                        id: '175b7404209f494b947ee7a052bc32d9'
                    }
                    'luxlab-module-cockpit': {
                        table: 'sys_app_module'
                        id: 'ab50e0017f764b0d8d55a990ffd3b629'
                    }
                    'luxlab-module-replay': {
                        table: 'sys_app_module'
                        id: '7acb31b79c4a4583a210fdbc677f4bb5'
                    }
                    'luxlab-replay-ai-si': {
                        table: 'sys_script_include'
                        id: '390b5cb55d774557bb36d31f950a1fc7'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '9a342eefd6294e2b926cf2f768c464e6'
                    }
                    pattern_analyst_agent: {
                        table: 'sn_aia_agent'
                        id: 'd2602a3d15094a38ab199cf0674f0bbc'
                    }
                    pattern_analyst_agent_acl: {
                        table: 'sys_security_acl'
                        id: '32ea91130d34461f878259d90f033751'
                    }
                    'pattern-api': {
                        table: 'sys_ws_definition'
                        id: '4e7ca45eaf0940cfa22a4700d4a30775'
                    }
                    'pattern-api-decide': {
                        table: 'sys_ws_operation'
                        id: '3d3d38d77549482fa948ad92ecd43a4b'
                    }
                    'pattern-api-list': {
                        table: 'sys_ws_operation'
                        id: '3e17c4ab3ac241369a79be0a9559c2f2'
                    }
                    'pattern-api-propose': {
                        table: 'sys_ws_operation'
                        id: 'bf7a3ba2a3ad4de89c565f05a9db9e28'
                    }
                    'pattern-api-refresh': {
                        table: 'sys_ws_operation'
                        id: 'ea65041c8e3649a49de9db43eded1a54'
                    }
                    'pattern-api-v1': {
                        table: 'sys_ws_version'
                        id: '84032c37540c43fb8465e74baffcb0b7'
                    }
                    'pattern-read-acl': {
                        table: 'sys_security_acl'
                        id: 'c5a4ac25d0164273bbf19353735ce167'
                    }
                    replay_analyst_agent: {
                        table: 'sn_aia_agent'
                        id: 'd08fde07453248e298af8227af2bff7c'
                    }
                    replay_analyst_agent_acl: {
                        table: 'sys_security_acl'
                        id: 'd9817e359bdd4924b3f9f235dd4324e7'
                    }
                    'replay-action-read-acl': {
                        table: 'sys_security_acl'
                        id: '47114d1c83674fd28d67decf9622f5e5'
                    }
                    'replay-api': {
                        table: 'sys_ws_definition'
                        id: '0194f7f860a9418f885fcfcf97c5a5b6'
                    }
                    'replay-api-analyse': {
                        table: 'sys_ws_operation'
                        id: 'ee51582082d04ed7ad9c7b204178458c'
                    }
                    'replay-api-build': {
                        table: 'sys_ws_operation'
                        id: 'efde19d8568448959debc79de9c10db1'
                    }
                    'replay-api-candidates': {
                        table: 'sys_ws_operation'
                        id: '80648ede016b4e6bbc2fd411767a79b8'
                    }
                    'replay-api-candidates-search': {
                        table: 'sys_ws_query_parameter'
                        id: 'b683118bef2044f8b31e8a7f258137fe'
                    }
                    'replay-api-decide': {
                        table: 'sys_ws_operation'
                        id: 'f87dd395126a4118b623feb202b49c2c'
                    }
                    'replay-api-follow-ups': {
                        table: 'sys_ws_operation'
                        id: '38f5d870deac43409c79527074504b49'
                    }
                    'replay-api-get': {
                        table: 'sys_ws_operation'
                        id: 'af161908a8d64c0c80379d0a9425ab66'
                    }
                    'replay-api-pir': {
                        table: 'sys_ws_operation'
                        id: '6dc05438192244edb75a9c249f952ab6'
                    }
                    'replay-api-pir-report': {
                        table: 'sys_ws_operation'
                        id: '9836c10ae71f4cdd9b384b57e791b1bc'
                    }
                    'replay-api-review': {
                        table: 'sys_ws_operation'
                        id: '0e7eafde40134922a2e01eb11e66dfb5'
                    }
                    'replay-api-v1': {
                        table: 'sys_ws_version'
                        id: '43048cd2a5804433a435a2829ce06481'
                    }
                    'replay-event-read-acl': {
                        table: 'sys_security_acl'
                        id: '6943743868e747fe845a01948983aa82'
                    }
                    'replay-read-acl': {
                        table: 'sys_security_acl'
                        id: '4490410aa9a84c8e8e52fce2608bff28'
                    }
                    'response-patterns-job': {
                        table: 'sysauto_script'
                        id: '54f919bb91614a34ad2b665fcc5decd3'
                    }
                    src_server_briefing_agents_ts: {
                        table: 'sys_module'
                        id: 'a96aa59000fc4ea2ace067c6e12c99d3'
                    }
                    src_server_briefing_tools_ts: {
                        table: 'sys_module'
                        id: '04b6353a0b594d48a1292129bad76b33'
                    }
                    src_server_cockpit_attention_ts: {
                        table: 'sys_module'
                        id: '299beb89febd4b54b62f81d15f76168e'
                    }
                    src_server_cockpit_overview_ts: {
                        table: 'sys_module'
                        id: '0a3d1a99698444378d500277ec9f3263'
                    }
                    src_server_cockpit_scope_ts: {
                        table: 'sys_module'
                        id: '70751692ba864c7e9b9aae3499eb8f02'
                    }
                    'src_server_jobs_response-patterns_js': {
                        table: 'sys_module'
                        id: 'a58a5bbc22974a92933d7151eb5e1821'
                    }
                    src_server_replay_ai_ts: {
                        table: 'sys_module'
                        id: '205d489efc1a4598b9b756e4ca006624'
                    }
                    'src_server_replay_ai-context_ts': {
                        table: 'sys_module'
                        id: 'fda3c807cbd54e8c8ff81e77a420d2df'
                    }
                    src_server_replay_analysis_ts: {
                        table: 'sys_module'
                        id: '48e0fce46f734f7aa2fe8e160bdd712b'
                    }
                    src_server_replay_analyst_ts: {
                        table: 'sys_module'
                        id: '6a697657a48c4708bc75fcda4d9b1300'
                    }
                    src_server_replay_candidates_ts: {
                        table: 'sys_module'
                        id: 'e4904319b9bf4a9bb5445d6dc137661b'
                    }
                    'src_server_replay_follow-ups_ts': {
                        table: 'sys_module'
                        id: '8aa5acdcb9584030aeaf886c85e66e29'
                    }
                    'src_server_replay_form-actions_ts': {
                        table: 'sys_module'
                        id: '1a6d86ba7c7b471aaf3c8f48cbfa409d'
                    }
                    src_server_replay_markdown_ts: {
                        table: 'sys_module'
                        id: '1d4467ee52a24c16bf5561d63abc4757'
                    }
                    'src_server_replay_pattern-ai_ts': {
                        table: 'sys_module'
                        id: '53b08c1f4888465896707271a31bf9ea'
                    }
                    'src_server_replay_pattern-store_ts': {
                        table: 'sys_module'
                        id: '700b2a7b18024177b06cc6737602ad69'
                    }
                    src_server_replay_patterns_ts: {
                        table: 'sys_module'
                        id: '4e85246d65064b8082709ae4b6e920b9'
                    }
                    src_server_replay_pir_ts: {
                        table: 'sys_module'
                        id: '0787389986724e97a66dfe25de9bf69b'
                    }
                    src_server_replay_related_ts: {
                        table: 'sys_module'
                        id: 'bdc51ff8883c417b883f4514b6a550df'
                    }
                    src_server_replay_sources_ts: {
                        table: 'sys_module'
                        id: '43f653c1ab0c457e8f7637f867dc10ce'
                    }
                    src_server_replay_store_ts: {
                        table: 'sys_module'
                        id: '6cf06f3012f1488389b8e3601c296de0'
                    }
                    src_server_replay_types_ts: {
                        table: 'sys_module'
                        id: '6f0932db08994b22b3712620b7ad9d45'
                    }
                    'src_server_rest_briefing-routes_ts': {
                        table: 'sys_module'
                        id: '2f12aa59aec04163a9f572edda3d77ab'
                    }
                    'src_server_rest_cockpit-routes_ts': {
                        table: 'sys_module'
                        id: 'deae9a4ec58d4ece97f3a5b3c140aff3'
                    }
                    'src_server_rest_pattern-routes_ts': {
                        table: 'sys_module'
                        id: '4c34f6f40795427e98f8b008ae1f8f76'
                    }
                    'src_server_rest_replay-routes_ts': {
                        table: 'sys_module'
                        id: '32471c280c314cbc82ddf0dc8fbcec79'
                    }
                    'src_server_rest_usage-routes_ts': {
                        table: 'sys_module'
                        id: '25c08e29bb9b46b886ff740d45968619'
                    }
                    'src_server_script-includes_LuxLabAgentRuntime_js': {
                        table: 'sys_module'
                        id: '8580ac3c8e42414392f24cbe8e7199d4'
                    }
                    'src_server_script-includes_LuxLabReplayAI_js': {
                        table: 'sys_module'
                        id: 'bd2a6125c7ff47b5be1f004e4b10f5bb'
                    }
                    src_server_usage_usage_ts: {
                        table: 'sys_module'
                        id: '78ebceddf51e4970b5e69b3670c438e9'
                    }
                    'usage-api': {
                        table: 'sys_ws_definition'
                        id: '803110d66a554b90b77c24459e37c704'
                    }
                    'usage-api-get': {
                        table: 'sys_ws_operation'
                        id: '95dba7c761424db6abf3eb0b9273964a'
                    }
                    'usage-api-get-days': {
                        table: 'sys_ws_query_parameter'
                        id: '2ee65f51719e42098fb2dafe36ce0a15'
                    }
                    'usage-api-rates': {
                        table: 'sys_ws_operation'
                        id: '0fbaa6c13e364c828263da9f33a5a6dc'
                        deleted: true
                    }
                    'usage-api-v1': {
                        table: 'sys_ws_version'
                        id: 'b73ef50f5cea4e35a8952ae9d9ec607d'
                    }
                }
                composite: [
                    {
                        table: 'sys_ui_element'
                        id: '00058a0503dd4a40bd887b57d8860fb2'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'silent_gaps'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0015086c74bb484a887567a78efc5900'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '006ff56315644799afb932c472282aab'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_pushed_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '009d4134f9a64ea8913d97607ffd9591'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'problem'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '00aa018c9be94b25ac830a999b0cf59e'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '01aa458a84f548e0a66bd8d4ced87066'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '01c9927f08d14e80b23a2eb6887996e1'
                        key: {
                            document_key: {
                                id: '73a84d4881e643b89d41fc15dce5efc7'
                                key: {
                                    name: 'View trigger'
                                    skill_config: {
                                        id: '4971dda0f2f7418e978d6266ceee35ee'
                                        key: {
                                            skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                        }
                                    }
                                    config_type: 'b89b1f0b7f821210076726d6ac86650e'
                                }
                            }
                            variable: '5c5623df7f025210076726d6ac8665f9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0209003bc1ef4b3d9cb0071b955d5fdc'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'phases'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0283fc611f2640b0b408a98be2dba61f'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0366c99f730d4e5897efeac63cdbefbe'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'problem'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '049ea6c8f4a14ab29a56450f4a4e626d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'reviewed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '04df8404f7744f19962c188d75d7c3bf'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'group'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '04ff5b004e4248efbab80523b36a154c'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'execution_ms'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_capability_definition'
                        id: '05504c0bddf24ed2beddda3199cf0028'
                        key: {
                            capability: '27c932b1fbbe47659e6b0bdea0f45737'
                            api: 'a55c1c6f530221106b38ddeeff7b12b1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '055688844e804edea536baab2e2324aa'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'occurred_at'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '05b18b5593fb4b928aea62227736409f'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'decided_on'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_gen_ai_feature_mapping'
                        id: '061f2b179c2849ab8512e4ba5e11d519'
                        key: {
                            feature_name: 'LuxLab Followup Advisor'
                            document: '190360efeb2f47efb449f012b48a5baf'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '06739b72e6264385838a01965e9b83fc'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'conversation'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: '06c0092b09ab4326a340d83e69f2bc61'
                        key: {
                            agent: 'd08fde07453248e298af8227af2bff7c'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '07099c4520de4cde963c6697e63b1232'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '075e7b0f14ca4aacaa78bc34ae6c30c2'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '07b61ae69d40417d8b93eafbd1a170da'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '07eac5027d2743a1b43b95d40776409a'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'silent_gaps'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '081530f3e74b4678973b9637b6cd5bda'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'to_value'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0923cbcc9261400fbcec45eacdd55989'
                        key: {
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b4989dbe62446e3b91c89f5eb4e118b'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'hidden'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0bbe654152b64c3887622870d144db9b'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0bbe9eceb77c4280a2bd8ac159e6ddb8'
                        key: {
                            name: 'x_everi_luxlab_replay'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0bd7f238ad964968826b61315ad1c028'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0c6a76c3b6ab4ace9267503a4004f2a2'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            value: 'triage'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0c93deab5a9e4789b31de2f56ca442a6'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0e17ea9c1c044eb79a34dd88397e406e'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'phase'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0e4b81cf143b40d5ac22b7199f48dad4'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '0ee8a75f4df246e2aef391897992e61e'
                        key: {
                            logical_table_name: 'x_everi_luxlab_pattern'
                            col_name_string: 'key'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0f6122d4415b4b99a9d51b39b01d5360'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'to_value'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1005476a49554fc8899a347316cd46f8'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'minutes_to_resolve'
                            position: '9'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '1042f6cab31e4f56a658c3e40cda68bc'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '11aed5c22e7549d0bba5286e07b14c8e'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                            value: 'monitoring'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '11d4d8789eda4f37b8ead3d7f20f7900'
                        key: {
                            name: 'Save follow-ups'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1201846e11b94e8ca3808e23dcd3c446'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'execution_ms'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '120b2098429648bca8cc3979e1f0bdd8'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'execution_plan'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '123808d3767f4303af782698ee9fc701'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'task'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '127c6117e6b941988efe76f63cd5cadd'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'opened_at'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1313d648f7c24078b727f97e0b994327'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '131a0b40f5354fe8802c291acf099d65'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '139d880d954d4de3af37dab9527c798b'
                        key: {
                            name: 'Get response pattern'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '14834a178da84ae1800e063d3199d25c'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'dimension'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '14fbe3c5e1a44bbe99373f1a6af8df37'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'description'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '155a19b2a22b494ba7ea84a4d91f2a8b'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'phase'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '16389ca607574aec8b40b481171fe72b'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'execution_ms'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '16d0a7fa2a9a41e6ad4cfb874420b231'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'incident'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '170d158c1c8b4df6a65f66b6904ddb8c'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'pir_flagged'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1920990bacad436eb2ce2b8f0c57c701'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'state'
                            value: 'proposed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1a9b70d2fa3c4615b2bdcb921a411b53'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'resolved_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1b2ac2bcab16448f8a6c480fb8894a27'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_report_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1cbcdb73e9a14cd38b3664d04bf51ce1'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'decided_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1d08103b2f274acdabd7b5fd9193eb2a'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'resolved_at'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1d4c71da5cef42a9ae173451f67ee86f'
                        key: {
                            sys_security_acl: '7c36262f1b2f441d8d1c1b3ca98cf3b5'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1d56def5d50c4c8eb04532125e97ea32'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '1d7cf7d4cf4449c48334e84909be79f4'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            caption: 'Run'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1d8c5e43e81b46ffafa1560492635033'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'decided_by'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1e9d9834f2014b0a91e7aff6fae6b345'
                        key: {
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'reviewed_on'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '1fdb9c7d41224c3e85f985cac996025b'
                        key: {
                            sys_ui_form: {
                                id: '3d27a475f92045038ed0944d5643fb29'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '20b461ed9d0840a086664dd3327307d4'
                        key: {
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'review'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: '214c9d9d957e44e8b7ba66375cb2afa2'
                        key: {
                            agent: '362aad95f29b4ac8a8aa0668a44005c4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '226a7a4b6c3244ae8972d94cb2fe0bf4'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'sequence'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2321a37a116b4278bb163d0286c6cec8'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '239f642984184762bda11478ac5d20d2'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'impact_start'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '2512d94edc5d44398bf5996797f801c1'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            caption: 'Replay'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '253d4f41935b453abc93d36285586cd7'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'plan_state'
                            position: '9'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_status'
                        id: '268e5d3ee690426482dc4606349d9b56'
                        key: {
                            skill_config: {
                                id: '362aad95f29b4ac8a8aa0668a44005c4'
                                key: {
                                    skill_id: '190360efeb2f47efb449f012b48a5baf'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '26b667c55adf453e92fec6affce27c6e'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26ec8c0f066f4a50b57d0f13e7ace40b'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '270a3b88acb9498cacb4dcd7d678925a'
                        key: {
                            role: {
                                id: 'a5bc249cde634fe6a9d4414ec534b604'
                                key: {
                                    name: 'x_everi_luxlab.manager'
                                }
                            }
                            contains: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2745d5db1b5e45329ddf38c29525d711'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2752c6f320804071b4297fa54b9383b1'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'incident_count'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill_config'
                        id: '279529df170d4da8bc595f4230a733fc'
                        key: {
                            skill_id: '764ea60a20ce45c2a3b5db85f61c3bd1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '279ad60fc7044c38a0e45d62cb80b0a7'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '28df1e7cdf6f4d56b4b86a7389436ea5'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'error'
                            position: '13'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '295722b0315f4d3bb2689e672550ad19'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '297bc0720b4b4d03b503120b4f1c5b4d'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'agent'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b4079463ef140ec8c43c0fbc3b692b2'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b5bf9c62119493ebafa8ac7cc8fae4c'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2b6c88750b7c4812b7bd32e4d8691de2'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                            value: 'accepted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2bdc7eab3c6e43758b18582242e264c3'
                        key: {
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2c03439919e246c893f760a8e566f903'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'from_value'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2c2b707c87e247a5ad3d96cf31413622'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'incident'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2e66d43930994d9e9312c7d2ceb27abf'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '2ebd95480ce140acb30ad60f86471620'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2edd173320314796bacbc1d15f2fbfc6'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'state'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2f7e0b10be1e47ac9dda0dfe41f61092'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2f8a63927fee45618c79f7689ef7bad3'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'incident'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3020765bb97c4182bdb235ccd9923970'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'incidents'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '304f5032abcc4a1a93c22d41c2234608'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '310b440b18cd42fc9298b52abfada19c'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '3178e771a804485697e9095979c4e7b6'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '31a74964b61c498dbb2018d3b9dd10c6'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'tool'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3213306a93a649f78b98d6003beaf273'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'decided_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '32b1fdd6ed6b48c1bbc6c4449fe80f03'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'state'
                            value: 'approved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '32c7e6d789c24fd98a711f00265b5110'
                        key: {
                            agent: 'd2602a3d15094a38ab199cf0674f0bbc'
                            tool: '46223de70c1a435d831d85e108fd1e47'
                            name: 'Save pattern proposal'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '33b20d68c87f45d7a32a8010f52f10b2'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'actor'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '35a47b6f05594bb3a98df42ebddcf122'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'reassignments'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '35c583e3e8cf43b2a19f0b9b0b1ba393'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'follow_ups_on'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config'
                        id: '362aad95f29b4ac8a8aa0668a44005c4'
                        key: {
                            skill_id: '190360efeb2f47efb449f012b48a5baf'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3652ee4116a34e7fb4b1bd23acafa0c7'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'finished_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '36c6c1419a1d4ddd9ef5eea61b2ccfdc'
                        key: {
                            application_file: '872cf825122f4be6b3d803f8ffa33940'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '36d2af62aa9e4b4b8a1cf93f4e18a7d6'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'agent'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3714b20ba4c4411b96b421e374565ddc'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '37aa1718ab7c417da83dcb6ff50145d2'
                        key: {
                            name: 'Get incident replay'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '37ea2e8c9c354a67b8236fa4192b990b'
                        key: {
                            agent: 'd08fde07453248e298af8227af2bff7c'
                            tool: '37aa1718ab7c417da83dcb6ff50145d2'
                            name: 'Get incident replay'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '38b601c434a04cc686667e4076f10ce2'
                        key: {
                            name: 'x_everi_luxlab_cockpit.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '38f9813bf07d4987964d55d40bd17318'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'group'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3977a44d03704189ada701a6c2332b92'
                        key: {
                            document_key: {
                                id: '9d5b5c3e055247c6892df59a9123530a'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '362aad95f29b4ac8a8aa0668a44005c4'
                                        key: {
                                            skill_id: '190360efeb2f47efb449f012b48a5baf'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: '4fee37d893b64210aa5730f164891896'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '39ec8846ab5b46d8a021de4f589d1d1b'
                        key: {
                            sys_security_acl: '6943743868e747fe845a01948983aa82'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3a0dabe6bdb146e8a8f89e3f33b86ca4'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'built_on'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '3d27a475f92045038ed0944d5643fb29'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '3d668ce659294bb0b0d3e3d475289a9c'
                        key: {
                            sys_ui_form: {
                                id: '3d27a475f92045038ed0944d5643fb29'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3d6e382100284e17888e8e1fae1b8777'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'incident'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3ec836081e5c499ebdc569c556912718'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'pir_pushed_on'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3f1c047754124b1a907b3a56e2ad6cf1'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            value: 'misrouted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3f906299c2d0490a94f203747ec83216'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '40e71322b68649bc87471157c062b3e6'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'to_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '40ebff7a60f1411089fa7929c5fcb38d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'output'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '413378237de4432e8e71d6d703604299'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sequence'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '42ff5956699243bfaa4895332f59ef61'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4397e68dc0b444c7aedbc958f36075fe'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '445ff435f2a045d8bb2f3421b88a9990'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'plan_state'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '45951ea1608748f4b572e6a6d618dde7'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'median_ttr'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '4615b83f00924dd1ad9e1a3aa7b38f8d'
                        key: {
                            endpoint: 'x_everi_luxlab_cockpit.do'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '46223de70c1a435d831d85e108fd1e47'
                        key: {
                            name: 'Save pattern proposal'
                        }
                    },
                    {
                        table: 'sn_aia_agent_config'
                        id: '48612153415447f89e32370160cd7368'
                        key: {
                            agent: 'd08fde07453248e298af8227af2bff7c'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4894ef70d41f44f5942345e05f2fcd02'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '490774d1ca474d74b2f1ad07080b9b56'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'error'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '490c00b9a76b4c13a3c08d844c3743d9'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'pir_pushed_count'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '49198c8faa6f4048826d91b41d62e162'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'incident'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '49207af344b34b0ebe4e8860749a1563'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'minutes_to_resolve'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config'
                        id: '4971dda0f2f7418e978d6266ceee35ee'
                        key: {
                            skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4995d96eaaee4bb6b9dd4ded19bd2479'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'knowledge'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '49fca2564bae461cac92ad249f00e0b5'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            value: 'fixing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4a95c50abd3241a396b1e3e4e6257800'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'decided_on'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4aa068f1f8c74ef182992defae52de32'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'proposed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4b3582f3dfe74b5db3240745103db3d2'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'target'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4b77dcdb808d4c0e933e5d14b85581eb'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4b7fc343490e4672b5a321c27a0efdff'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4b7fe4c8a6bb406c853ec3136d0e6d0d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'error'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4c03d6f671f2424e8b81d3e4ce2ac8c2'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'output'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4c63b2c4348d42e3b049c0539791799b'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kind'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4d12b4cdd0c8499295437b05d6c50cda'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                            value: 'process'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4d72dfc948914671aa3272bfb177aaf0'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4ea47fa94af24363baf659cef8f78fc1'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            value: 'detection'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4ea93c3432cb4c05a55434757dc19b7c'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'type'
                            value: 'action'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4f14bc620c844fd1b85debc09f6de69b'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4f5ea6c827c94d03a4f9c09e00760273'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'tool'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '50a9174a52944f169a7ae073f40026a5'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '510a9b20385c4b6a84f2c4f4ce30e8fa'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '545963d7020e4ff5b3d21e0bab0456b7'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            value: 'waiting'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '54b38e09d03846edaa198db86c63e3b9'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'comms'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '55173b375221417883cb81811fb451a8'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'proposal'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '562ba7ce101d413ca9e7bccb5edb3f7c'
                        key: {
                            document_key: {
                                id: 'fed63b9e36094f619a35e6659aee9cd8'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '4971dda0f2f7418e978d6266ceee35ee'
                                        key: {
                                            skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: '4fee37d893b64210aa5730f164891896'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '564bf85d006d4ba88cf140849662dc71'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'summary'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5695be9d9bc348b6ae8f6c4fc43cfb64'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'minutes_to_resolve'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '571baf1acc624b3a8b83749a0fa53752'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_report'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '57a6bb8f0a534b49a795c4664fd9a9be'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'decided_by'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '57dcdf85f7b64e3caaa5586ab7f283c0'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'event_key'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '58a9fbe6ffbe4d9aa59d40a71eab4184'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '58eaba8c7c5845e9a9a659efbe3b4771'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'reviewed_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '590f929420a7462d8abbee9065144feb'
                        key: {
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'follow_ups_on'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '596e756e42f2414480f8ee10b2ebb8af'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                            value: 'knowledge'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '5986c6211754413aabdbac9542171ffe'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5bc384802871455d8f6a2726dfeeb61d'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'child'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '5c0007ba3bd44ee0b384483df02f5ceb'
                        key: {
                            name: 'x_everi_luxlab.user'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5c4f09662d8745efb10a24a3d5c95f8e'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'resolved_at'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5cc7bd56f13e4187b63e8dad29270d95'
                        key: {
                            document_key: {
                                id: 'fed63b9e36094f619a35e6659aee9cd8'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '4971dda0f2f7418e978d6266ceee35ee'
                                        key: {
                                            skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: 'ab5ef79893b64210aa5730f16489185a'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5ce3d5538fd6482a80b317e345ecbbca'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actor'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_generative_ai_prompt_config'
                        id: '5ce66f8eff034357a2377fa714bd9021'
                        key: {
                            ai_config: 'ab72e875ca864345b1102aea4821d4e1'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: '5d04ee6f3bb14a83806d828150389293'
                        key: {
                            agent: '4971dda0f2f7418e978d6266ceee35ee'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5d0c7d0e6993445da0853c1489a8fb7b'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'replay'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5dd411e773344e5d8bc9d13e1b0034b1'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'user'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5e0076fa60644a4aba03bc1486623238'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'knowledge'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '603f8f758371409aa1007a56cdc2cc42'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'opened_at'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6139d6d923994c1a82e49df53762bef4'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'key_moment'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '615da7cd0970499393dd4294d1383ce1'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'target'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '617855159a184364af537c28a5e1b4e2'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            caption: 'Follow-up'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6287094ca3ba482587122f2530baff09'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'event_count'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill_config'
                        id: '62ac437147c64e998fa928d63969f964'
                        key: {
                            skill_id: 'e2a1eceaa50743a88051aa5a191bf5e5'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '62cd389286bb4e6eaf1fb69c67e4a712'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '62f132db98994a9b9d5dc150fb12713e'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'key_moment'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '63069a4185514b8c827ed5462458fdb1'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '633b8f779c9646aaa1117c88750455ce'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_report'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '63742d36cc5e4c2692995d0e0084ecd2'
                        key: {
                            name: 'Save blameless review'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '63cff80e20ae44468051bd0f946deecc'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                            value: 'dismissed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6443c2a5353c4f8f8c6c9acbaacc26b7'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'from_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill_applicability'
                        id: '6583bb28b1d84cdf9a6a81846c400025'
                        key: {
                            skill_id: 'e2a1eceaa50743a88051aa5a191bf5e5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6614493da9774858acc6dcf3711762db'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'title'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6696e8d09d0a440394f14ca7da54605d'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '66b39c817f3942cc8399696405459421'
                        key: {
                            document_key: {
                                id: '9d5b5c3e055247c6892df59a9123530a'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '362aad95f29b4ac8a8aa0668a44005c4'
                                        key: {
                                            skill_id: '190360efeb2f47efb449f012b48a5baf'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: 'f09e3f9893b64210aa5730f16489189f'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: '6a8aee25eb3544e99033ba493ba8a410'
                        key: {
                            resource_mapping: {
                                id: 'f6c888e6ebb04af797e1ad631d49bae3'
                                key: {
                                    parent_capability: '27c932b1fbbe47659e6b0bdea0f45737'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetReplay'
                                }
                            }
                            resource_attribute_name: '0bd1117b7f211210210ca65c4d8665ed'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '6cf883ccfef440fa90ee8f9ec36e64a5'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e0588670a0a48d3bfea5969e6f84b0e'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'incident'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6f6f8aae86944ff9a32eebd505212ba6'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'event_key'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: '701b40bdb88b410fb57fad472c461e50'
                        key: {
                            web_service_operation: '80648ede016b4e6bbc2fd411767a79b8'
                            web_service_query_parameter: 'b683118bef2044f8b31e8a7f258137fe'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '70c73b9539314f8685f7bac9e3697fd6'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'rationale'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '711904c3dd9543d58d335621ed4caec8'
                        key: {
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '71eacb79432e4a1aa931031f7471b8c4'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actor'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '71f9042ac2074189a2a3db433fd2099b'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'pir_id'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '72380caa818e4a208aea070ff77f8de8'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'handoffs'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_gen_ai_strategy_mapping'
                        id: '723ec8fac79b4d26913b9db040669a89'
                        key: {
                            strategy: 'CAPABILITY_EXECUTION'
                            feature: {
                                id: 'fe38f5d30ced43aaa38894dbae9f5747'
                                key: {
                                    feature_name: 'LuxLab Incident Review Writer'
                                    document: '27c932b1fbbe47659e6b0bdea0f45737'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_aia_version'
                        id: '7240e455e78e429aac376d143a28ab3a'
                        key: {
                            target_id: 'd08fde07453248e298af8227af2bff7c'
                            version_name: 'V1'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '72f89711b5dd4f0891607a08fded966c'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '730bd06da273484a941dac0c2d4f9647'
                        key: {
                            application_file: 'a074b70932f449a08b114eaa3ce8c18b'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '732a4150cc9d4a60b6185afb6fcc8ca8'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'summary'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '739e2eeffd5b451e9bff6d9b63614543'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_var_set'
                        id: '73a84d4881e643b89d41fc15dce5efc7'
                        key: {
                            name: 'View trigger'
                            skill_config: {
                                id: '4971dda0f2f7418e978d6266ceee35ee'
                                key: {
                                    skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                }
                            }
                            config_type: 'b89b1f0b7f821210076726d6ac86650e'
                        }
                    },
                    {
                        table: 'sys_one_extend_definition_config'
                        id: '73df47faf08841268f9cccc4f77a8859'
                        key: {
                            definition: {
                                id: '05504c0bddf24ed2beddda3199cf0028'
                                key: {
                                    capability: '27c932b1fbbe47659e6b0bdea0f45737'
                                    api: 'a55c1c6f530221106b38ddeeff7b12b1'
                                }
                            }
                            capability: '27c932b1fbbe47659e6b0bdea0f45737'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '74d0c9d3cb4545d0938ffda9300d6677'
                        key: {
                            ui_action: 'cb265c90e273440c9add9938f90dbfc4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '75b37740156d43a882ca15e703cfdff4'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'replay'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill'
                        id: '764ea60a20ce45c2a3b5db85f61c3bd1'
                        key: {
                            skill_document: '190360efeb2f47efb449f012b48a5baf'
                            skill_table: 'sys_one_extend_capability'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '76c3cd810aed4964b8d67e87a8c7fea0'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kind'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '77e280c11a974af283a79e632bcf1670'
                        key: {
                            agent_access_config: {
                                id: '214c9d9d957e44e8b7ba66375cb2afa2'
                                key: {
                                    agent: '362aad95f29b4ac8a8aa0668a44005c4'
                                }
                            }
                            role: {
                                id: '51dc63b45fa046da93262f5135f5efbf'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_var_set'
                        id: '78300d812278477bbc6d6661720f2a17'
                        key: {
                            name: 'View trigger'
                            skill_config: {
                                id: '362aad95f29b4ac8a8aa0668a44005c4'
                                key: {
                                    skill_id: '190360efeb2f47efb449f012b48a5baf'
                                }
                            }
                            config_type: 'b89b1f0b7f821210076726d6ac86650e'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '785c38342475498b83aec536462b170c'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'finished_on'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '78b65b82e54e43c3949ae911c5005386'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7a825046facb453cbdc95f5cbcc5de72'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '7b5331490a3646e38b57285d190332fc'
                        key: {
                            agent: 'd2602a3d15094a38ab199cf0674f0bbc'
                            tool: '139d880d954d4de3af37dab9527c798b'
                            name: 'Get response pattern'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7c67e6c4f0f84cc7bd8ac121729bbc73'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'state'
                            value: 'dismissed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '7d38c219b0294411a6787d21c94fc753'
                        key: {
                            sys_ui_form: {
                                id: '50a9174a52944f169a7ae073f40026a5'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d3d97d4384544bab20a5d6435714767'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'error'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d43b632416846fe80c3a3b2fe557a8e'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'sequence'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d599bd21c8b402ca99f85aca2034576'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'occurred_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7dac50253e1140c39f674f03ef632940'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                            value: 'waiting'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7eeeab0e7f024611a7bbf9fb65a18419'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'facets'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7f0b9b090878486698c87b4baf5c3918'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                            value: 'misroute'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7fe26597215a45b79987c29d5742f24d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'reassignments'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '807af6a7f89a4a3780364fddcf62a3b3'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'key'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '812eca2fc48b437983f555cc3657d5e2'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'decided_by'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '81cc56faf0394725957ec73078a46b56'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8264b237337d4e1598c662762533e98c'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                            value: 'gaps'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '828351fb35ac4bb1894d6c049f4727f3'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'key_moment'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '82d75896ec0e403883f6242575687aef'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: '837075abda874f2681abbb3e61126a1c'
                        key: {
                            resource_mapping: {
                                id: 'f6c888e6ebb04af797e1ad631d49bae3'
                                key: {
                                    parent_capability: '27c932b1fbbe47659e6b0bdea0f45737'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetReplay'
                                }
                            }
                            resource_attribute_name: 'a3911d3b7f211210210ca65c4d86651b'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '8385216b349844f79cf49abb501aad29'
                        key: {
                            agent_access_config: {
                                id: '5d04ee6f3bb14a83806d828150389293'
                                key: {
                                    agent: '4971dda0f2f7418e978d6266ceee35ee'
                                }
                            }
                            role: {
                                id: 'e5e1a778cf8347bdaa4039337b96bf06'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '844785004c9b4bc8814c2b9d26e7b4fe'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'article'
                            position: '14'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '84e73f4dc2b44bafa0cc0e6fbe435fa8'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '84fe7d014d9043ccac94b522de4628aa'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: '8564449a2fd14c5ea69a318b7275f160'
                        key: {
                            agent: 'd2602a3d15094a38ab199cf0674f0bbc'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            caption: 'Event'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '86a8dd604b95437f9a97cab63156e1e1'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'kind'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill_applicability'
                        id: '86a9f4b7bd494055b7d0d52a1828287b'
                        key: {
                            skill_id: '764ea60a20ce45c2a3b5db85f61c3bd1'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '872cf825122f4be6b3d803f8ffa33940'
                        key: {
                            name: 'x_everi_luxlab/main'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87bc9a9ab9fe426db997ac309c94a43b'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'detail'
                        }
                    },
                    {
                        table: 'sys_gen_ai_strategy_mapping'
                        id: '88268b70367a422a8a71ec3b4d1ca158'
                        key: {
                            strategy: 'CAPABILITY_EXECUTION'
                            feature: {
                                id: '061f2b179c2849ab8512e4ba5e11d519'
                                key: {
                                    feature_name: 'LuxLab Followup Advisor'
                                    document: '190360efeb2f47efb449f012b48a5baf'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '88964868bf864f539859994cb1f03c10'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'plan_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '893f3f4a0c394e2baa6750be3df767ce'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'detail'
                            position: '17'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '897724e5c2f24257aaea026296a258a5'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'first_seen'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '89df9408022d4388ae6913633497163c'
                        key: {
                            application_file: '4615b83f00924dd1ad9e1a3aa7b38f8d'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8b3f1134ab3b40dab608253c47e1289b'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8b57bc2aa7324a88ae547e013ee791ee'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'problem'
                        }
                    },
                    {
                        table: 'sn_aia_agent_config'
                        id: '8c8fe66b4d6943a3997b3c60392b3f1a'
                        key: {
                            agent: 'd2602a3d15094a38ab199cf0674f0bbc'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8caf82b021974823bb8ced2006bcb78e'
                        key: {
                            sys_security_acl: 'beccc07d8e664cb58cc6370dd7ecb9de'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8db248bbea3f480cb1a1773c6f9057f5'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'replay'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8e31321e753644c4961ba8ffd7e92084'
                        key: {
                            sys_security_acl: '043664e62bed42eba1dfa1d637ab365b'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '8fce9999568247a983231bb88cbca7f5'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '903ef8b9088c471daed3778b317d76b8'
                        key: {
                            agent_access_config: {
                                id: '06c0092b09ab4326a340d83e69f2bc61'
                                key: {
                                    agent: 'd08fde07453248e298af8227af2bff7c'
                                }
                            }
                            role: {
                                id: 'a980d2cf77cd4342884f0ee1aa208c8c'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9066321084b14c6a98033eae62250758'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '922d2740113c4abea916765fd40672b6'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'finished_on'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '923ae9059f7849fa895e121f5682438d'
                        key: {
                            document_key: {
                                id: '78300d812278477bbc6d6661720f2a17'
                                key: {
                                    name: 'View trigger'
                                    skill_config: {
                                        id: '362aad95f29b4ac8a8aa0668a44005c4'
                                        key: {
                                            skill_id: '190360efeb2f47efb449f012b48a5baf'
                                        }
                                    }
                                    config_type: 'b89b1f0b7f821210076726d6ac86650e'
                                }
                            }
                            variable: '5c5623df7f025210076726d6ac8665f9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '929d8ca155c945798af34962cc8fa666'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'error'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '936e3297111c4fee9f896044c67ce2c7'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '937a969f02014731b3903700a81f82cb'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_id'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '93a88a2801d84cd8ac11b1aee2a42180'
                        key: {
                            ui_action: '723843cb8b3d4a0eb47d6e566bafa681'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: '953dd7d745a045f582948c69dc5eb246'
                        key: {
                            resource_mapping: {
                                id: 'b7da9aa891c14c699d6e5a8c8b0a6957'
                                key: {
                                    parent_capability: '190360efeb2f47efb449f012b48a5baf'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetReplay'
                                }
                            }
                            resource_attribute_name: '0bd1117b7f211210210ca65c4d8665ed'
                        }
                    },
                    {
                        table: 'sys_one_extend_capability_definition'
                        id: '954404eb5f6a455fbebd986f4279e2f1'
                        key: {
                            capability: '190360efeb2f47efb449f012b48a5baf'
                            api: 'a55c1c6f530221106b38ddeeff7b12b1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9554128e30f24196ba5f8c51573fac85'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'execution_plan'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '956b63da6bf9412986fe81fcf3792337'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'review'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '96115f9fc89c41e3ab94ac952410a7f3'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '9716ea17caf24e8795ba73eb71296c9d'
                        key: {
                            agent_access_config: {
                                id: '8564449a2fd14c5ea69a318b7275f160'
                                key: {
                                    agent: 'd2602a3d15094a38ab199cf0674f0bbc'
                                }
                            }
                            role: {
                                id: '8ae0a4eb71bf49e29b6daf221622be62'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '97bed57624944298b42aabaea3f9302b'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'rationale'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '99a174973a01484daec3e5ab258a80df'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'kind'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '9a6176e7366a488997897c33d52acb14'
                        key: {
                            agent: 'd08fde07453248e298af8227af2bff7c'
                            tool: '11d4d8789eda4f37b8ead3d7f20f7900'
                            name: 'Save follow-ups'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9b117e794fa541548c1fb48dade5e9da'
                        key: {
                            sys_security_acl: '181b2ebe68214dcc8c5edcd9545a3ce9'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9b1ef0836bc540b29de3c340d928c630'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'impact_start'
                            position: '6'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_var_set'
                        id: '9d5b5c3e055247c6892df59a9123530a'
                        key: {
                            name: '__delivery_step__'
                            skill_config: {
                                id: '362aad95f29b4ac8a8aa0668a44005c4'
                                key: {
                                    skill_id: '190360efeb2f47efb449f012b48a5baf'
                                }
                            }
                            config_type: '7dfdff5893b64210aa5730f164891837'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9d6ffff6ac0040f3bfad224ddedb71db'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '9d735e08879c4ac39ebfea8ab8b6a369'
                        key: {
                            sys_ui_form: {
                                id: 'b81a7182e5d2429e8746cea611637783'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9e3ff37d4eb84eb3bf45c1a6cd29ba7e'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'ongoing'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9ec1eacad5854fdeadafec10e840dcf1'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'replay'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '9f4cf5d0c6cc45ca8b10ae731d4f6f80'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9fdf8e62c6834445a37562eeedf8d904'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_pushed_on'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'a074b70932f449a08b114eaa3ce8c18b'
                        key: {
                            name: 'x_everi_luxlab/vendor-react-dom--55da69dc'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a0d219fa0bd24060bb5d53c6c1fd40ce'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a333a2de2e4248459db35613151004a5'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: 'a3ffb3af2d4e4a61aead71fcb2ce9854'
                        key: {
                            parent_capability: '190360efeb2f47efb449f012b48a5baf'
                            resource_capability: '190360efeb2f47efb449f012b48a5baf'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4919a55897242cd84c47379f4010600'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'execution_plan'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4de4c3541d0448f9ecb1eb7f13ba580'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'decided_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: 'a510976e6ec94aee95ad026b3953a981'
                        key: {
                            agent: 'd08fde07453248e298af8227af2bff7c'
                            tool: '63742d36cc5e4c2692995d0e0084ecd2'
                            name: 'Save blameless review'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a51895cb7b974986b3b59c0b9809fd6c'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'incident_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a5a0aa32512f483681e536fcf40fe294'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'execution_plan'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'a5bc249cde634fe6a9d4414ec534b604'
                        key: {
                            name: 'x_everi_luxlab.manager'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a60ab0a65b4d4af684fbbc88d9165094'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a677a7f3ad66474fb3ca51ef92a4ba55'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'phases'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a68476d34ce641ecbd3347950c4bba4d'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'baseline_ttr'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'a6a9b2f4fa7841c581cbdb2deb6c3b07'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a7d0165b579149d5add8b641e34225f7'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'analysis'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a860eb0448fc40338d0aebbf627688b5'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'summary'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a942e87370df4a4b9e9ca0bdde933958'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'audit'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a969c3ca2ef14f399f3388b8b82fe7e9'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'finished_on'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: 'a96b5f97121a4b96965d177690aaa353'
                        key: {
                            web_service_operation: '677dd28ff63a431a8ba569e671e17577'
                            web_service_query_parameter: '7d15a438fca044dc93ea28bdbb476e87'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a981eb465ef44fe38cd2bfc3e3fed8a6'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'first_seen'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a9cf317d36fd4b0bbf3b40345f640465'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'median_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aa90fba4394a468f857747156be5b0e3'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aae5a285a11c49a1ad87a23a10ff5a75'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'execution_ms'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ab38ea8d3bd54b8e874cfc06991add47'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'pir_report_on'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ab83610ff02a4ca8abd2bb121160b0cc'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'ongoing'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aba31351148a41cea9bc32bc08cf6e84'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'replay'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ac34f9a6697046198e0c163c41d5769f'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'ac959be30f41480e9bf50e2f277f3154'
                        key: {
                            logical_table_name: 'x_everi_luxlab_replay'
                            col_name_string: 'incident'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'ac9784ac9fd6410cb7b510e062bc4b5f'
                        key: {
                            application_file: 'aed3a55c110e4ea78cdb89440df5ea74'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'acad90e9ad9146e7895b4f9073065e9c'
                        key: {
                            application_file: 'bb3751cf94664cfa8a2556edaba72872'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'acdf173127d242699be71054dc3b2cc5'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'facets'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ad654965fe8c452aaf685195de8121a5'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'replay'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ae552e6b65cb46b380238d4b720b3787'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aeb230bf8aa848d8a8d6727ac34eabd4'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'actor'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'aed3a55c110e4ea78cdb89440df5ea74'
                        key: {
                            name: 'x_everi_luxlab/vendor-react-dom--55da69dc.js.map'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b0033b0e84fc49e2a820b433a8187de7'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'type'
                            value: 'problem'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b0ce831a13fc44cfb8875e103ecb509d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'detail'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b0db3e1a986a45edbfd5250d5c30a5bf'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'mined_on'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            caption: 'Analysis'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b231cb33e07b4b15849f80391991878e'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'agent'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b2419242ef954008b4607f4f3c937a29'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'minutes_lost'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b25742b56cae4b3290db420963a15d19'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'detail'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'b2a89b2eb4ec41c4bcb27cc154c072a5'
                        deleted: true
                        key: {
                            logical_table_name: 'x_everi_luxlab_setting'
                            col_name_string: 'name'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b305bdb70eb64bcf93d27ec5980b1991'
                        key: {
                            sys_security_acl: '8353b59b0a37412181517c523f86845d'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b3172fb098f74f39b946c66dd2b4d8d0'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'article'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b3da3a6653994f20a23a934537cf1a8d'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'pir_flagged'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b46c85647847485fb65368253e1b9eb3'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'sla'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'b47df276cab14727bf187eb9626fb816'
                        key: {
                            logical_table_name: 'x_everi_luxlab_replay_event'
                            col_name_string: 'replay'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: 'b7da9aa891c14c699d6e5a8c8b0a6957'
                        key: {
                            parent_capability: '190360efeb2f47efb449f012b48a5baf'
                            resource_capability: '51d095f77f211210210ca65c4d866591'
                            resource_name: 'GetReplay'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b80a709456d14bf7af5590072b74247c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'b81a7182e5d2429e8746cea611637783'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b8359deff79d45ebb7f4a7fe982e9ebe'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'hidden'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b88d53974fd247739717b37b8a59c0b6'
                        key: {
                            sys_security_acl: '48ec5cf559984eca839737fa7bd0054a'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b8cc4401ba47421da6e7228628253fac'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'state'
                            value: 'completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b8efa9d9ac18477f9bb6e402292d86ab'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'knowledge'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b9a5ff790d23468d914cd8e0f4091dac'
                        key: {
                            sys_security_acl: 'ddd62c2670104823bb08ae956afb4673'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ba3b914bcf1b4a789b0b93b9d2ecddc0'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ba5166eb332d46fd8bdc2072123d31cf'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'occurred_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'ba787b65054c4fa98e432b844ca2a571'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            caption: 'Replay AI'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'bb3751cf94664cfa8a2556edaba72872'
                        key: {
                            name: 'x_everi_luxlab/main.js.map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bb5b540f3c5d43c3bb068da0d7cdf777'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'decided_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bd225824222745d78b69958ef6ae7267'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                            element: 'value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bd9a9c441cb246f4b39b21f1bb736908'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bff92f0f9c2549559697d99f1f112f8b'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c1cfecd9181b4bf9a56ca0ede713f820'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c266f29e0fc1441c8d55a05451cd2303'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_report_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c26eadaea60b4a7292409bdf1b4e6d54'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'phases'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c29178389322466a9e41d04716b87954'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
                            value: 'recovery'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c2a9c5c2725c44a2b38630d3ff544b94'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'phases'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c31aeca7d55048a595c6888f75fa25ac'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'silent_gaps'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c3660812394e47a890d5d35639ac3b9d'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'handoffs'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c462d109e18649e79406dd973bb59789'
                        key: {
                            sys_security_acl: 'c74490f361a04251a630a45978008cab'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c523ba7d4a0045639146f42ad60b72e4'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'built_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c5f6a9d129b549a19971ae8919ab6fd9'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'incidents'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c5fc8f7bb8c04fcea2ef2208a93b0747'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'status'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c6c74a660afa48f0abbf09e4bdbdd453'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'conversation'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c7dbaca5f2084c02a415753bf145acbe'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'silent_gaps'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c876cca2388840a2ad0028d89832c4a3'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'ongoing'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cabfd96a6b2846f384cd32387255af70'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'to_value'
                            position: '16'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'caccd543367a4af59a0ab6c300db078a'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cb76db622ba449f6b4f7b453946aa606'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'rationale'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cbcf1f99496b4607b17c3f64fe907a45'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_pushed_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cd5805a00a674981afbf75e550beb84b'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'problem'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cd59aaf9b5324bd9acdc02d142e19ec3'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cd606e9e42414678b6b4d21a75a75a4c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cde9f5ea82494042b04f9ddc4807302b'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'state'
                            value: 'running'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ce40a5a4064546e78c9c8884600e8052'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'pir_pushed_count'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ce4e4c9928714adfbed9dcfda386ad76'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'problem'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cf777a56915b486ea5443277d824e2dd'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'pir_flagged'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cfe923fcd5ef48a387a54f95ad889256'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'tool'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd0038115f7074ad8b727be5b7d7f7bd8'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'follow_ups_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd011fb60b9694e869dbb9bf2461cdb8c'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd0283866fab242408750a4ba51eb782a'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'handoffs'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd0936b7a5c3949d293293ef20f3382ea'
                        key: {
                            sys_security_acl: '47114d1c83674fd28d67decf9622f5e5'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd1412ae3a21640698a9beb6ef87189ff'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'active'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'd16f89f979c14244a13195a86d46a026'
                        key: {
                            application_file: '1999a76ccd3090eedefa0d99fc1fda2d'
                            source_artifact: 'dcebc911908d4f67aeb52170cafa506a'
                        }
                    },
                    {
                        table: 'sn_aia_version'
                        id: 'd1d1fd9bd82248fb9018f6bafb693728'
                        key: {
                            target_id: 'd2602a3d15094a38ab199cf0674f0bbc'
                            version_name: 'V1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd1e3b057c5544c9b91dc48cfead4c110'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'median_minutes'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd29ec7ba56f84802bf787398708d2592'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'conversation'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd2bff36b62d44265ad2fc1ecbe9f70e9'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd3a661dc45fc40b39d588e9c3a1eec75'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'record'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd3f84784c87d43489f1a249547c7fc7d'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'proposed_on'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd54f46a3936346d281d2e6a2f6dc6147'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd6092e5f56bf489796c723dc2bf2a702'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'error'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd61293c3bf0a4e1eb03173636267a2db'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'baseline_ttr'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd66b8217a8004e60a1178facad2dc99b'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                            value: 'routing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd67d106faa6146b1a37a30135b6b4bac'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'd6b50a2342144dc9b7b7c16a5887a2c1'
                        key: {
                            sys_ui_form: {
                                id: 'a6a9b2f4fa7841c581cbdb2deb6c3b07'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd6bb3d8c7a9a46a2a7825edc3ba3ab1c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'source'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd779b0d41bcc4133b4c8bafc46de7fc5'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'event_count'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd8207ef3b09e444a831e74505fcdfc04'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'opened_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd846bd5d5e224503b0ca515c22e2ee0f'
                        key: {
                            document_key: {
                                id: 'fed63b9e36094f619a35e6659aee9cd8'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '4971dda0f2f7418e978d6266ceee35ee'
                                        key: {
                                            skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: 'f09e3f9893b64210aa5730f16489189f'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd8c0fa3fcbef473fa860ea1b792ac39c'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'plan_state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd92a5e61b2224aaea8a871cde02f824a'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'type'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd9dbc0b2aba14d46b2410adf3bac3437'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'conversation'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_one_extend_definition_config'
                        id: 'da78eec8d57746eaa39aabc5c94768a3'
                        key: {
                            definition: {
                                id: '954404eb5f6a455fbebd986f4279e2f1'
                                key: {
                                    capability: '190360efeb2f47efb449f012b48a5baf'
                                    api: 'a55c1c6f530221106b38ddeeff7b12b1'
                                }
                            }
                            capability: '190360efeb2f47efb449f012b48a5baf'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dacbfd1d393b49b08a961a77a01993f0'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'type'
                            value: 'knowledge'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'db0057a9dde7439384983596faec32eb'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'event_count'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dc778688408a484a9351bbf7bcbac9aa'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'incident'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'dcebc911908d4f67aeb52170cafa506a'
                        key: {
                            name: 'aiux-source 1999a76ccd3090eedefa0d99fc1fda2d'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dcf808a5ba6f46d2bdc9fa6a63bcaa59'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de1d022bdb334de8a162dcecc4e1f3c4'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de5770d9ba484aefa6af84c25a4f1c16'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: 'dee3a730af284d1888fb8b542c43c06a'
                        key: {
                            web_service_operation: '677dd28ff63a431a8ba569e671e17577'
                            web_service_query_parameter: '07811fe5c25e4639a89997a08ce0e0f0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'defd5a2ff2774408a732498088b50b4e'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'source'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'df1b0cbbc9c840e28b2aea4478dd75a8'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                            value: 'new'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'df800c1f967e48f6a9686fccebd38bf1'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'from_value'
                            position: '15'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e0e561498098450ebf0793382f28b801'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e19a0a55db27430a8648e212d9256a5b'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'impact_start'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'e209f9838bb84a89ae0b53610672e6c3'
                        key: {
                            sys_ui_form: {
                                id: '3d27a475f92045038ed0944d5643fb29'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'ba787b65054c4fa98e432b844ca2a571'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay AI'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e28bc21d64f2459e978dad35e04d4aa6'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill'
                        id: 'e2a1eceaa50743a88051aa5a191bf5e5'
                        key: {
                            skill_document: '27c932b1fbbe47659e6b0bdea0f45737'
                            skill_table: 'sys_one_extend_capability'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e2e13e86cff34146b6ef1965b33eb172'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'built_on'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e30e27b937cb4f80a6bb8e695bb093e1'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'from_value'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e30e7edb6e7540da8b216b2524814046'
                        key: {
                            sys_security_acl: 'c5a4ac25d0164273bbf19353735ce167'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e4c1810644a441859bacff4ce6a47361'
                        key: {
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'status'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e525ae1adbee4178b015b143eae073a7'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'error'
                            position: '12'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_status'
                        id: 'e526d4897f66486587d00c1fa12c90f9'
                        key: {
                            skill_config: {
                                id: '4971dda0f2f7418e978d6266ceee35ee'
                                key: {
                                    skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'e5e7f0fc494d4a47aff0dabd30e1438e'
                        key: {
                            name: 'x_everi_luxlab_replay'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e5f842b28e8e46749fba425c40d90421'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'median_ttr'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e68fe1c7483643d883995f35545cb7de'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'decided_on'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e6a12d4adcde41af84590c62f43144c5'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'fix_type'
                            value: 'problem'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e6e1778e624f40e6a26ec886ba5ed882'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'title'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e78689fe718e417dbea896ed7fa324be'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'dimension'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e7f45ad0dc0742f08176df9f2d2a9cad'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'rationale'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e828e151cebe49b2a59c9f5526c4955c'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e844fd6118954c6ea3b33d97e15a8ec2'
                        key: {
                            sys_ui_section: {
                                id: '85890b6dc8ab49209d4ddf0d4eee61f0'
                                key: {
                                    name: 'x_everi_luxlab_replay_event'
                                    caption: 'Event'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'event_key'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e87ae95e4d894d6eb2f0a5d41c6cfe8c'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'incident'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eabc45b9a8fd42f8bf4e4883ee31283d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eacdf44091ed48879de1d4ca3c0594ac'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'review'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'eae57e34fc8440feb4f174a71beec7fa'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'eb01618d571f4d9db07c142d0477ae2c'
                        key: {
                            sys_security_acl: '4490410aa9a84c8e8e52fce2608bff28'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ebb60edc11d242dd9608f35682fc71ce'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'incident'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ebd966c3a99c409abdc6a93c46deac79'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'minutes_lost'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ec5ab483f768448e9505aa992709feaa'
                        key: {
                            sys_ui_section: {
                                id: '1d7cf7d4cf4449c48334e84909be79f4'
                                key: {
                                    name: 'x_everi_luxlab_briefing_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'agent'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ee2dfe2a8aad42daab66cdab8883afd2'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'error'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'ee90940f6e8c472a890c57e4d8aef38f'
                        key: {
                            sys_ui_form: {
                                id: '3d27a475f92045038ed0944d5643fb29'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '2512d94edc5d44398bf5996797f801c1'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Replay'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eee38a2428784449a99c684ae5e13ad4'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'proposal'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ef123ae624cc479d8575287b21d2aba9'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f0f97662efe74d219c03250bcb722df4'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'journal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f1291023dd7f4fcabcd36a7e113f19fe'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'event_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: 'f1906ab927cd4e2b9f8f6843b82d98c0'
                        key: {
                            resource_mapping: {
                                id: 'b7da9aa891c14c699d6e5a8c8b0a6957'
                                key: {
                                    parent_capability: '190360efeb2f47efb449f012b48a5baf'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetReplay'
                                }
                            }
                            resource_attribute_name: 'a3911d3b7f211210210ca65c4d86651b'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: 'f1b5ca478dd4465588ed3ded6212e92d'
                        key: {
                            parent_capability: '27c932b1fbbe47659e6b0bdea0f45737'
                            resource_capability: '27c932b1fbbe47659e6b0bdea0f45737'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f3787eb4a1e1453fa8d8f8d1a5c05dff'
                        deleted: true
                        key: {
                            name: 'x_everi_luxlab_setting'
                            element: 'value'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f3c85e8a6f654d7faf89eb4152e6fad0'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_edge'
                        id: 'f3ccdd3b4c0c4eb4ab1f6a843a5529b9'
                        key: {
                            internal_name: 'GetReplay__LuxLab Incident Review Writer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f512ce37572f4295adcb66613aec8a34'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'output'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: 'f60f1f71e81a4ebe90e0289a26398787'
                        key: {
                            web_service_operation: '95dba7c761424db6abf3eb0b9273964a'
                            web_service_query_parameter: '2ee65f51719e42098fb2dafe36ce0a15'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f6839cb0874e4987ab33dece0b8c3d6d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'status'
                            value: 'ready'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: 'f6c888e6ebb04af797e1ad631d49bae3'
                        key: {
                            parent_capability: '27c932b1fbbe47659e6b0bdea0f45737'
                            resource_capability: '51d095f77f211210210ca65c4d866591'
                            resource_name: 'GetReplay'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f7194b53ea9c47508059aad2d845d0cc'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                            value: 'proposed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_generative_ai_prompt_config'
                        id: 'f783fa31dccf44a2bcc7757e7e09743b'
                        key: {
                            ai_config: 'b36cd5df9e074da4ad7d99c4625414e0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f861dfdd7e1a45c8a5300f7a6f8404b4'
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'description'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f8a724024c5b4d8489140431dbe09a68'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '617855159a184364af537c28a5e1b4e2'
                                key: {
                                    name: 'x_everi_luxlab_replay_action'
                                    caption: 'Follow-up'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f91d23de5f5f4de0a30f35046d779744'
                        key: {
                            sys_ui_section: {
                                id: 'b12d1675fbba4225b1e39b9f2e897fd9'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Analysis'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'reassignments'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fa241d11c4354159acf6fb76d8fc3e64'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'pir'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fac897bd530a4d1097463d9c107b4708'
                        key: {
                            name: 'x_everi_luxlab_replay_action'
                            element: 'article'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_edge'
                        id: 'fae38c76d0424ab0be2e86efa8d5762a'
                        key: {
                            internal_name: 'GetReplay__LuxLab Followup Advisor'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fb7d1bdb49a4409da1055953feccbdd7'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'alert'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fc0b3079487447409d931627fca27f32'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fcafaab43127429ab38e874b1c687ad6'
                        key: {
                            sys_ui_section: {
                                id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                                key: {
                                    name: 'x_everi_luxlab_replay'
                                    caption: 'Post incident review'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fceb5952e1374cfdb093af6043c60a2e'
                        key: {
                            name: 'x_everi_luxlab_briefing_run'
                            element: 'output'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fd0a9f00e3a540f6809ea7a5d4e4b8ee'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'type'
                            value: 'detection'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fd215bd85c9a4d1c90c7500152c6b795'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'mined_on'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fd7e29bd090a49078d63f8e0aec9abb8'
                        key: {
                            name: 'x_everi_luxlab_pattern'
                            element: 'key'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fd7f3a2269ea4f928077b0d1b912b02f'
                        key: {
                            document_key: {
                                id: '9d5b5c3e055247c6892df59a9123530a'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '362aad95f29b4ac8a8aa0668a44005c4'
                                        key: {
                                            skill_id: '190360efeb2f47efb449f012b48a5baf'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: 'ab5ef79893b64210aa5730f16489185a'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'fd85efe16b2e4487b0a778690cdd5cb4'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            caption: 'Post incident review'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_gen_ai_feature_mapping'
                        id: 'fe38f5d30ced43aaa38894dbae9f5747'
                        key: {
                            feature_name: 'LuxLab Incident Review Writer'
                            document: '27c932b1fbbe47659e6b0bdea0f45737'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_var_set'
                        id: 'fed63b9e36094f619a35e6659aee9cd8'
                        key: {
                            name: '__delivery_step__'
                            skill_config: {
                                id: '4971dda0f2f7418e978d6266ceee35ee'
                                key: {
                                    skill_id: '27c932b1fbbe47659e6b0bdea0f45737'
                                }
                            }
                            config_type: '7dfdff5893b64210aa5730f164891837'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ff6899baa5e44a968e25d0757669f8c9'
                        key: {
                            sys_security_acl: '040f35ad641545fc99a3e2c8af21ff90'
                            sys_user_role: {
                                id: '5c0007ba3bd44ee0b384483df02f5ceb'
                                key: {
                                    name: 'x_everi_luxlab.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ff77fd074a624819b782f708855549df'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'hidden'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
