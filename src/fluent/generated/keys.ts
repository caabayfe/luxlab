import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '60135a3bfff84e1a921c9ef84a46266d'
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
                    package_json: {
                        table: 'sys_module'
                        id: '9a342eefd6294e2b926cf2f768c464e6'
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
                    'src_server_rest_cockpit-routes_ts': {
                        table: 'sys_module'
                        id: 'deae9a4ec58d4ece97f3a5b3c140aff3'
                    }
                }
                composite: [
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: '36c6c1419a1d4ddd9ef5eea61b2ccfdc'
                        key: {
                            application_file: '872cf825122f4be6b3d803f8ffa33940'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
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
                        table: 'sys_ui_page'
                        id: '4615b83f00924dd1ad9e1a3aa7b38f8d'
                        key: {
                            endpoint: 'x_everi_luxlab_cockpit.do'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: '730bd06da273484a941dac0c2d4f9647'
                        key: {
                            application_file: 'a074b70932f449a08b114eaa3ce8c18b'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: '89df9408022d4388ae6913633497163c'
                        key: {
                            application_file: '4615b83f00924dd1ad9e1a3aa7b38f8d'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
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
                        table: 'sys_ux_lib_asset'
                        id: 'a074b70932f449a08b114eaa3ce8c18b'
                        key: {
                            name: 'x_everi_luxlab/vendor-react-dom--55da69dc'
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
                        table: 'sys_ws_query_parameter_map'
                        id: 'a96b5f97121a4b96965d177690aaa353'
                        key: {
                            web_service_operation: '677dd28ff63a431a8ba569e671e17577'
                            web_service_query_parameter: '7d15a438fca044dc93ea28bdbb476e87'
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
                        table: 'sys_ux_lib_asset'
                        id: 'aed3a55c110e4ea78cdb89440df5ea74'
                        key: {
                            name: 'x_everi_luxlab/vendor-react-dom--55da69dc.js.map'
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
                        table: 'sys_ws_query_parameter_map'
                        id: 'dee3a730af284d1888fb8b542c43c06a'
                        key: {
                            web_service_operation: '677dd28ff63a431a8ba569e671e17577'
                            web_service_query_parameter: '07811fe5c25e4639a89997a08ce0e0f0'
                        }
                    },
                ]
            }
        }
    }
}
