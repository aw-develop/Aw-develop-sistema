# Redesign do painel AWDevelop — validação

Branch: `design/admin-enterprise-redesign`. Pull request: #2.

## Escopo aplicado
- Shell, sidebar e topbar: ajustes visuais de densidade, contraste e espaçamento.
- Overview e métricas: grids responsivos e tipografia.
- Mixin de páginas administrativas: cards, barras de ações, listas, títulos e grids.
- CRM e prospecção: filtros, tabs, botões e cards.

## Verificações obrigatórias antes de merge
- [ ] `npm ci`
- [ ] `npm run build:angular`
- [ ] `npm test`
- [ ] Inspecionar desktop 1920/1440/1366, tablet 768 e mobile 390/360.
- [ ] Conferir login, logout, guardas de rota e perfis editor/comercial/owner.
- [ ] Conferir edição de conteúdo, imagens, rascunho, prévia e publicação.
- [ ] Conferir CRM: Kanban, filtros, tarefas, notas, status e ações.
- [ ] Conferir prospecção: abas, filtros, resultados e oportunidades.
- [ ] Conferir orçamentos, reuniões, histórico e administradores.
- [ ] Validar foco de teclado, contraste, zoom 200% e redução de movimento.
- [ ] Comparar capturas antes/depois e corrigir regressões.

## Observações
As mudanças até aqui são visuais e não constituem redesign integral concluído. O build, os testes e a revisão visual em navegador ainda não foram executados neste fluxo. Não fazer merge nem deploy em produção até aprovação.
