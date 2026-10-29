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
                    'replay-api': {
                        table: 'sys_ws_definition'
                        id: '0194f7f860a9418f885fcfcf97c5a5b6'
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
                    'replay-api-get': {
                        table: 'sys_ws_operation'
                        id: 'af161908a8d64c0c80379d0a9425ab66'
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
                    src_server_replay_analysis_ts: {
                        table: 'sys_module'
                        id: '48e0fce46f734f7aa2fe8e160bdd712b'
                    }
                    src_server_replay_candidates_ts: {
                        table: 'sys_module'
                        id: 'e4904319b9bf4a9bb5445d6dc137661b'
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
                    'src_server_rest_cockpit-routes_ts': {
                        table: 'sys_module'
                        id: 'deae9a4ec58d4ece97f3a5b3c140aff3'
                    }
                    'src_server_rest_replay-routes_ts': {
                        table: 'sys_module'
                        id: '32471c280c314cbc82ddf0dc8fbcec79'
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
                        table: 'sys_db_object'
                        id: '07099c4520de4cde963c6697e63b1232'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
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
                        table: 'sys_db_object'
                        id: '0bbe9eceb77c4280a2bd8ac159e6ddb8'
                        key: {
                            name: 'x_everi_luxlab_replay'
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
                        id: '0e17ea9c1c044eb79a34dd88397e406e'
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
                        table: 'sys_choice_set'
                        id: '131a0b40f5354fe8802c291acf099d65'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
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
                        table: 'sys_dictionary'
                        id: '1d08103b2f274acdabd7b5fd9193eb2a'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'resolved_at'
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
                        table: 'sys_documentation'
                        id: '2b4079463ef140ec8c43c0fbc3b692b2'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2c03439919e246c893f760a8e566f903'
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
                        table: 'sys_choice_set'
                        id: '2ebd95480ce140acb30ad60f86471620'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
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
                        table: 'sys_ui_page'
                        id: '4615b83f00924dd1ad9e1a3aa7b38f8d'
                        key: {
                            endpoint: 'x_everi_luxlab_cockpit.do'
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
                        table: 'sys_documentation'
                        id: '4b7fe4c8a6bb406c853ec3136d0e6d0d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'error'
                            language: 'en'
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
                        id: '5695be9d9bc348b6ae8f6c4fc43cfb64'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'minutes_to_resolve'
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
                        table: 'sys_documentation'
                        id: '6443c2a5353c4f8f8c6c9acbaacc26b7'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'from_value'
                            language: 'en'
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
                        table: 'sys_ws_query_parameter_map'
                        id: '701b40bdb88b410fb57fad472c461e50'
                        key: {
                            web_service_operation: '80648ede016b4e6bbc2fd411767a79b8'
                            web_service_query_parameter: 'b683118bef2044f8b31e8a7f258137fe'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '71eacb79432e4a1aa931031f7471b8c4'
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
                        table: 'sys_documentation'
                        id: '72380caa818e4a208aea070ff77f8de8'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'handoffs'
                            language: 'en'
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
                        table: 'sys_ui_element'
                        id: '76c3cd810aed4964b8d67e87a8c7fea0'
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
                        table: 'sys_dictionary'
                        id: '7a825046facb453cbdc95f5cbcc5de72'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'phase'
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
                        table: 'sys_dictionary'
                        id: '7fe26597215a45b79987c29d5742f24d'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'reassignments'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: '89df9408022d4388ae6913633497163c'
                        key: {
                            application_file: '4615b83f00924dd1ad9e1a3aa7b38f8d'
                            source_artifact: '38b601c434a04cc686667e4076f10ce2'
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
                        table: 'sys_documentation'
                        id: '99a174973a01484daec3e5ab258a80df'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'kind'
                            language: 'en'
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
                        table: 'sys_ws_query_parameter_map'
                        id: 'a96b5f97121a4b96965d177690aaa353'
                        key: {
                            web_service_operation: '677dd28ff63a431a8ba569e671e17577'
                            web_service_query_parameter: '7d15a438fca044dc93ea28bdbb476e87'
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
                        table: 'sys_ui_element'
                        id: 'b0ce831a13fc44cfb8875e103ecb509d'
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
                        table: 'sys_documentation'
                        id: 'b25742b56cae4b3290db420963a15d19'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'detail'
                            language: 'en'
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
                        table: 'sys_ui_element'
                        id: 'b80a709456d14bf7af5590072b74247c'
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
                        table: 'sys_ux_lib_asset'
                        id: 'bb3751cf94664cfa8a2556edaba72872'
                        key: {
                            name: 'x_everi_luxlab/main.js.map'
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
                        table: 'sys_documentation'
                        id: 'c523ba7d4a0045639146f42ad60b72e4'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'built_on'
                            language: 'en'
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
                        table: 'sys_choice_set'
                        id: 'caccd543367a4af59a0ab6c300db078a'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cd606e9e42414678b6b4d21a75a75a4c'
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
                        table: 'sys_dictionary'
                        id: 'd0283866fab242408750a4ba51eb782a'
                        key: {
                            name: 'x_everi_luxlab_replay'
                            element: 'handoffs'
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
                        table: 'sys_ui_element'
                        id: 'd6bb3d8c7a9a46a2a7825edc3ba3ab1c'
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
                        table: 'sys_ws_query_parameter_map'
                        id: 'dee3a730af284d1888fb8b542c43c06a'
                        key: {
                            web_service_operation: '677dd28ff63a431a8ba569e671e17577'
                            web_service_query_parameter: '07811fe5c25e4639a89997a08ce0e0f0'
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
                        table: 'ua_table_licensing_config'
                        id: 'e5e7f0fc494d4a47aff0dabd30e1438e'
                        key: {
                            name: 'x_everi_luxlab_replay'
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
                        id: 'fb7d1bdb49a4409da1055953feccbdd7'
                        key: {
                            name: 'x_everi_luxlab_replay_event'
                            element: 'source'
                            value: 'alert'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                ]
            }
        }
    }
}
