# Sobre o Projeto
Esta API oferece funcionalidades para gerenciar refeições diárias e acompanhar hábitos alimentares. Permite aos usuários criar uma conta, registrar refeições, visualizar estatísticas e muito mais. O código está implementado em TypeScript, com testes automatizados abrangentes para garantir confiabilidade. O projeto foi desenvolvido com o intuito de se desafiar e aprofundar os conhecimentos em TypeScript. A utilização de cookies para identificação de sessão proporciona uma experiência segura e amigável ao usuário.

# Funcionalidades
## Gerenciamento de Usuários
- Criar Usuário: Endpoint para criar um novo usuário.

- Identificação do Usuário: Os usuários são identificados por meio de cookies de sessão para solicitações contínuas.

# Registro de Refeições
- Registrar Refeição: Registrar uma refeição com os seguintes detalhes:
  - Associação com o usuário
  - Nome
  - Descrição
  - Data e Hora
  - Conformidade com a dieta

- Listar Refeições: Obter todas as refeições de um usuário específico.

- Visualizar Refeição: Obter detalhes de uma única refeição.

- Editar Refeição: Modificar informações da refeição, incluindo nome, descrição, data e status da dieta.

- Excluir Refeição: Remover uma refeição previamente registrada.

# Métricas
- Métricas do Usuário: Obter várias métricas para um usuário, incluindo:
  - Total de refeições registradas
  - Total de refeições dentro da dieta
  - Total de refeições fora da dieta
- Melhor sequência de refeições em conformidade com a dieta

# Autorização
- Os usuários só podem visualizar, editar e excluir refeições que eles criaram.