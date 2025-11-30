

import { prisma } from '../src/db/prisma'; 



import { NivelAcesso, ResultadoTeste, StatusComponente, StatusFase, TipoAeronave, TipoComponente, TipoTeste } from '../src/generated/prisma/client';


import bcrypt from "bcrypt"; 



async function main() {

    console.log('Iniciando seed...');





    const colaborador1SenhaHash = await bcrypt.hash("admin123", 10);
    const colaborador2SenhaHash = await bcrypt.hash("senha123", 10);
    const colaborador3SenhaHash = await bcrypt.hash("paysandurebaixado", 10);
    const colaborador4SenhaHash = await bcrypt.hash("pythonlegal", 10);




    

    const colaborador1 = await prisma.colaborador.upsert({ 

        where: { usuario: 'admin' },

        update: { senha: colaborador1SenhaHash },

        create: {

            nome: 'Admin Principal',

            telefone: '99999-9999',

            endereco: 'Sede do Sistema',

            usuario: 'admin',

            senha: colaborador1SenhaHash, // Senha hasheada

            nivelAcesso: NivelAcesso.ADMINISTRADOR,

        },


    });



    const colaborador2 = await prisma.colaborador.upsert({

        where: { usuario: 'maria' },

        update: { senha: colaborador2SenhaHash },

        create: {

            nome: 'Maria',

            telefone: '11988888888',

            endereco: 'Rua Teste, 456',

            usuario: 'maria',

            senha: colaborador2SenhaHash, // Senha hasheada

            nivelAcesso: NivelAcesso.ENGENHEIRO,

        },
        
        

    });

      const colaborador3 = await prisma.colaborador.upsert({

        where: { usuario: 'Gerson' },

        update: { senha: colaborador3SenhaHash },

        create: {

            nome: 'Gerson Ama o Remo',

            telefone: '11988888888',

            endereco: 'Rua da Calyspso, 123',

            usuario: 'Gerson',

            senha: colaborador3SenhaHash, // Senha hasheada

            nivelAcesso: NivelAcesso.OPERADOR,

        },
        
        

    });

     const colaborador4 = await prisma.colaborador.upsert({

        where: { usuario: 'Massa' },

        update: { senha: colaborador4SenhaHash },

        create: {

            nome: 'Fernando Massanori',

            telefone: '11988888888',

            endereco: 'Rua Pythonica, 123',

            usuario: 'Massa',

            senha: colaborador4SenhaHash, // Senha hasheada

            nivelAcesso: NivelAcesso.OPERADOR,

        },
        
        

    });



    




    const projeto = await prisma.projetoAeronave.upsert({

        where: { codigo: 'PA-001' },

        update: {},

        create: {

            codigo: 'PA-001',

            modelo: 'X100',

            tipo: TipoAeronave.COMERCIAL,

            capacidade: 180,

            alcance: 2500,

            componentes: {

                create: [

                    {

                        nome: 'Asa Direita',

                        tipo: TipoComponente.NACIONAL,

                        fornecedor: 'Fornecedor A',

                        status: StatusComponente.EM_PRODUCAO,

                    },

                    {

                        nome: 'Motor Esquerdo',

                        tipo: TipoComponente.IMPORTADA,

                        fornecedor: 'Fornecedor B',

                        status: StatusComponente.EM_TRANSPORTE,

                    },

                ],

            },

            fases: {

                create: [

                    {

                        nome: 'Montagem Inicial',

                        prazo: '2025-12-31',

                        ordem: 1,

                        status: StatusFase.PENDENTE,

                        colaboradores: {

                            connect: [{ id: colaborador1.id }, { id: colaborador2.id }],

                        },

                    },

                    {

                        nome: 'Inspeção de Segurança',

                        prazo: '2026-01-15',

                        ordem: 2,

                        status: StatusFase.PENDENTE,

                        colaboradores: {

        

                            connect: [{ id: colaborador2.id }],

                        },

                    },

                ],

            },

            testes: {

                create: [

                    { tipo: TipoTeste.ELETRICO, resultado: ResultadoTeste.APROVADO },

                    { tipo: TipoTeste.HIDRAULICO, resultado: ResultadoTeste.REPROVADO },

                ],

            },

        },

    });



    console.log('Seed finalizada!');

}



main()

    .catch(console.error)

    .finally(async () => {

        await prisma.$disconnect();

    });