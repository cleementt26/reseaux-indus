const titles={cours:'Comprendre le cours',exercices:'Refaire les exercices',formules:'Les formules',tp:'TP & simulations',sources:'Supports & suite'};
const lessons=[...document.querySelectorAll('.lesson')];
function route(){let s=lessons.find(s=>s.id===(location.hash.slice(1)||'c-synthese'))||lessons[0];lessons.forEach(x=>x.hidden=x!==s);document.querySelectorAll('.mode-nav a').forEach(a=>{const active=a.dataset.group===s.dataset.group;a.classList.toggle('active',active);active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});document.getElementById('breadcrumb').textContent=titles[s.dataset.group];document.getElementById('chapter-label').textContent=titles[s.dataset.group];const list=lessons.filter(x=>x.dataset.group===s.dataset.group),links=document.getElementById('chapter-links');links.replaceChildren();list.forEach(x=>{const a=document.createElement('a');a.href='#'+x.id;a.textContent=x.querySelector('h2').textContent;a.classList.toggle('active',x===s);if(x===s)a.setAttribute('aria-current','page');links.append(a)});const bottom=document.getElementById('page-bottom'),i=list.indexOf(s);document.querySelector('.main').dataset.group=s.dataset.group;const position=document.querySelector('.status');position.textContent='Fiche '+(i+1)+' / '+list.length;position.setAttribute('aria-label','Fiche '+(i+1)+' sur '+list.length+' : '+titles[s.dataset.group]);bottom.replaceChildren();for(const [label,x] of [['Précédent',list[i-1]],['Continuer',list[i+1]]])if(x){const a=document.createElement('a');a.href='#'+x.id;a.className='page-link '+(label==='Continuer'?'next':'previous');const icon=document.createElement('span');icon.className='page-arrow';icon.setAttribute('aria-hidden','true');icon.textContent=label==='Continuer'?'→':'←';const text=document.createElement('span');text.className='page-link-text';const direction=document.createElement('span');direction.className='page-direction';direction.textContent=label;const title=document.createElement('strong');title.className='page-title';title.textContent=x.querySelector('h2').textContent;text.append(direction,title);a.append(icon,text);bottom.append(a)}document.title=s.querySelector('h2').textContent+' · Réseaux';closeMenu();window.scrollTo({top:0,left:0,behavior:'instant'})}
const sidebar=document.getElementById('sidebar'),menuButton=document.querySelector('.menu-button'),backdrop=document.getElementById('menu-backdrop'),mainPane=document.querySelector('.main');
function closeMenu(restoreFocus=false){const wasOpen=sidebar.classList.contains('open');sidebar.classList.remove('open');menuButton.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');backdrop.hidden=true;mainPane.inert=false;if(wasOpen&&restoreFocus)menuButton.focus()}
function openMenu(){sidebar.classList.add('open');menuButton.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');backdrop.hidden=false;mainPane.inert=true;document.querySelector('.menu-close').focus()}
document.querySelector('.menu-close').addEventListener('click',()=>closeMenu(true));backdrop.addEventListener('click',()=>closeMenu(true));sidebar.addEventListener('click',e=>{if(e.target.closest('a')){closeMenu();document.getElementById('main').focus({preventScroll:true})}});
window.matchMedia('(max-width:760px)').addEventListener('change',e=>{if(!e.matches)closeMenu()});
document.querySelectorAll('.diagram-svg').forEach(svg=>{const w=document.createElement('div');w.className='diagram-scroll';w.tabIndex=0;w.setAttribute('role','region');w.setAttribute('aria-label','Schéma : faire défiler horizontalement sur téléphone');const hint=document.createElement('p');hint.className='diagram-hint';hint.textContent='↔ Fais glisser le schéma pour tout voir';svg.before(hint,w);w.append(svg);svg.style.setProperty('--diagram-width',svg.viewBox.baseVal.width+'px')});
document.querySelectorAll('table').forEach(t=>{if(t.parentElement.classList.contains('table-wrap'))return;const w=document.createElement('div');w.className='table-wrap';w.tabIndex=0;w.setAttribute('role','region');w.setAttribute('aria-label','Tableau : faire défiler si nécessaire');t.before(w);w.append(t)});
window.addEventListener('hashchange',route);menuButton.addEventListener('click',()=>sidebar.classList.contains('open')?closeMenu(true):openMenu());document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu(true);if(e.key==='Tab'&&sidebar.classList.contains('open')){const items=[...sidebar.querySelectorAll('a,button')],first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const layerCopy={4:'TCP ajoute les ports et les informations utiles à un échange fiable. Le résultat est un segment TCP.',3:'IPv4 ajoute notamment les IP source et destination, le TTL et les champs de fragmentation. Le résultat est un paquet IPv4.',2:'Ethernet ajoute les adresses MAC pour le lien local et un FCS en fin de trame. Le résultat est une trame Ethernet.'};document.querySelectorAll('[data-layer]').forEach(b=>b.addEventListener('click',()=>{const box=b.closest('.diagram');box.querySelectorAll('[data-layer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));box.querySelectorAll('[data-level]').forEach(x=>x.classList.toggle('selected',x.dataset.level===b.dataset.layer));box.querySelector('.layer-explain').textContent=layerCopy[b.dataset.layer]}));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table=(headers,rows)=>'<div class="table-wrap" tabindex="0" role="region" aria-label="Résultat du calcul"><table><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
const error=(el,msg)=>el.innerHTML='<p class="error">'+esc(msg)+'</p>';
function fragment(total,mtu){if(!Number.isInteger(total)||total<20||total>65535||!Number.isInteger(mtu)||mtu<28||mtu>65535)throw Error('Entre une longueur totale entière de 20 à 65 535 et une MTU entière de 28 à 65 535 octets.');if(total<=mtu)return [{fragment:1,data:total-20,total,offset:0,mf:0}];const max=8*Math.floor((mtu-20)/8),data=total-20,out=[];let sent=0;while(sent<data){const size=Math.min(max,data-sent);out.push({fragment:out.length+1,data:size,total:size+20,offset:sent/8,mf:sent+size<data?1:0});sent+=size}return out}
function updateFragment(total,mtu){const el=document.getElementById('fragment-result');try{const r=fragment(total,mtu),shown=r.length>80?[...r.slice(0,5),...r.slice(-3)]:r;el.innerHTML='<p><strong>'+r.length+' '+(r.length>1?'fragments':'paquet')+'</strong> · Données initiales : '+(total-20)+' octets. '+(r.length===1?'Le paquet tient dans la MTU.':'Maximum non final : '+r[0].data+' octets de données.')+'</p>'+table(['Fragment','Données (octets)','Total IPv4','Offset','MF'],shown.map(x=>[x.fragment,x.data,x.total,x.offset,x.mf]))+(shown.length<r.length?'<p class="caption">Tableau abrégé : les cinq premiers et les trois derniers fragments.</p>':'')+'<p class="caption">Vérification : somme des données = '+r.reduce((s,x)=>s+x.data,0)+' octets ; chaque paquet ≤ '+mtu+' octets. Surcharge supplémentaire : '+20*(r.length-1)+' octets.</p>';return r}catch(e){error(el,e.message);throw e}}
document.getElementById('fragment-form')?.addEventListener('submit',e=>{e.preventDefault();try{updateFragment(Number(document.getElementById('frag-total').value),Number(document.getElementById('frag-mtu').value))}catch{}});
function checksum(words){let sum=0,steps=[];for(const w of words){sum+=w;const raw=sum;while(sum>65535)sum=(sum&65535)+(sum>>>16);steps.push([hex(w),raw.toString(16).toUpperCase(),hex(sum)])}return {sum,checksum:(~sum)&65535,steps}}const hex=n=>n.toString(16).toUpperCase().padStart(4,'0');
document.getElementById('checksum-form')?.addEventListener('submit',e=>{e.preventDefault();const el=document.getElementById('checksum-result'),parts=document.getElementById('checksum-input').value.trim().split(/[\s,;]+/);if(parts.length>100||!parts.every(w=>/^(0x)?[0-9a-f]{1,4}$/i.test(w))){error(el,'Entre de 1 à 100 mots hexadécimaux, chacun de 1 à 4 chiffres (0 à 9, A à F).');return}const r=checksum(parts.map(w=>parseInt(w.replace(/^0x/i,''),16)));el.innerHTML=table(['Mot ajouté','Somme avant report','Somme sur 16 bits'],r.steps)+'<div class="result">Somme reportée = <strong>0x'+hex(r.sum)+'</strong><br>Checksum = <strong>0x'+hex(r.checksum)+'</strong><br>Contrôle : '+hex(r.sum)+' + '+hex(r.checksum)+' = FFFF</div>'});
function divideCRC(bits,g){let a=[...bits].map(Number),b=[...g].map(Number),steps=[];for(let i=0;i<=a.length-b.length;i++)if(a[i]===1){const aligned='0'.repeat(i)+g+'0'.repeat(a.length-i-b.length);for(let j=0;j<b.length;j++)a[i+j]^=b[j];steps.push({aligned,after:a.join('')})}return {remainder:a.slice(-(g.length-1)).join(''),steps}}
function updateCRC(d,g){const el=document.getElementById('crc-result');if(!/^[01]{1,64}$/.test(d)||!/^1[01]{0,15}1$/.test(g)){error(el,'D doit contenir 1 à 64 bits ; G doit contenir 2 à 17 bits et commencer et finir par 1.');throw Error('Données CRC invalides')}const r=g.length-1,padded=d+'0'.repeat(r),c=divideCRC(padded,g),frame=d+c.remainder,check=divideCRC(frame,g);el.innerHTML='<p>Degré r = '+r+' ; on divise <code>'+padded+'</code> par <code>'+g+'</code>.</p><details class="solution"><summary>Voir les XOR successifs</summary><pre>'+esc(padded+'\n'+c.steps.map(s=>s.aligned+'  XOR\n'+s.after).join('\n'))+'</pre></details><div class="result">CRC : <strong>'+c.remainder+'</strong><br>Trame envoyée : <code>'+frame+'</code><br>Reste à la réception : <strong>'+check.remainder+'</strong></div>';return {crc:c.remainder,frame,receiverRemainder:check.remainder}}
document.getElementById('crc-form')?.addEventListener('submit',e=>{e.preventDefault();try{updateCRC(document.getElementById('crc-data').value.trim(),document.getElementById('crc-gen').value.trim())}catch{}});
function aloha(n,p){return n*p*Math.pow(1-p,n-1)}
function updateAloha(){const n=Number(document.getElementById('aloha-n').value),p=Number(document.getElementById('aloha-p').value),el=document.getElementById('aloha-result');if(!Number.isInteger(n)||n<1||n>200){error(el,'Choisis un nombre entier de stations entre 1 et 200.');return}const fmt=n=>n.toLocaleString('fr-FR',{maximumFractionDigits:3}),s=aloha(n,p),idle=Math.pow(1-p,n),collision=Math.max(0,1-idle-s);document.getElementById('aloha-p-value').textContent=fmt(p);el.innerHTML='N = '+n+', p = '+fmt(p)+' : <strong>'+fmt(s*100)+' % de succès</strong>.<br>Créneaux vides : '+fmt(idle*100)+' % · Collisions : '+fmt(collision*100)+' %.<br>Maximum à p = 1/'+n+' = '+fmt(1/n)+' : <strong>'+fmt(aloha(n,1/n)*100)+' %</strong>.';const xmax=Math.min(1,4/n),ymax=n===1?1:.55,x=v=>55+v/xmax*605,y=v=>195-v/ymax*160;let path='';for(let i=0;i<=240;i++){const p=xmax*i/240;path+=(i?'L':'M')+x(p).toFixed(2)+' '+y(aloha(n,p)).toFixed(2)}document.getElementById('aloha-chart').innerHTML='<path d="M55 25V195H660" fill="none" stroke="#94a8c3" stroke-width="1.5"/><g font-size="13" fill="#526479"><text x="10" y="35">'+(ymax*100).toFixed(0)+' %</text><text x="25" y="200">0</text><text x="54" y="220">0</text><text x="580" y="220">p = '+fmt(xmax)+'</text><text x="80" y="24">Efficacité S(p)</text></g><path d="'+path+'" fill="none" stroke="#225ce0" stroke-width="3"/><line x1="'+x(1/n)+'" x2="'+x(1/n)+'" y1="35" y2="195" stroke="#087964" stroke-dasharray="5 4"/>'+(p<=xmax?'<circle cx="'+x(p)+'" cy="'+y(s)+'" r="6" fill="#05a6b9" stroke="white" stroke-width="2"/>':'')+'<text x="'+(Math.min(x(1/n)+8,565))+'" y="55" font-size="13" fill="#087964">p optimal</text>'}
document.getElementById('aloha-n')?.addEventListener('input',updateAloha);document.getElementById('aloha-p')?.addEventListener('input',updateAloha);document.getElementById('aloha-opt')?.addEventListener('click',()=>{const n=Number(document.getElementById('aloha-n').value);if(Number.isInteger(n)&&n>0&&n<=200){document.getElementById('aloha-p').value=1/n;updateAloha()}});
document.querySelectorAll('[data-vlan-action]').forEach(b=>b.addEventListener('click',()=>{const box=b.closest('.diagram'),broadcast=b.dataset.vlanAction==='broadcast';box.querySelector('.vlan-explain').textContent=broadcast?'PC1 diffuse dans le VLAN 10 : PC2, PC3, PC7 et PC8 reçoivent le broadcast. Le VLAN 20 ne le reçoit pas. Le trunk transporte cette diffusion entre S1 et S2.':'PC1 et PC4 sont dans deux VLAN et deux sous-réseaux différents. PC1 transmet à sa passerelle ; le routeur émet une nouvelle trame dans le VLAN 20 vers PC4. Le trunk seul ne réalise pas ce routage.';box.querySelectorAll('.vlan-ee,.vlan-trunk').forEach(x=>{x.style.stroke='#225ce0';x.style.strokeWidth='5'});box.querySelectorAll('.vlan-cs').forEach(x=>{x.style.opacity=broadcast?'.2':'1';x.style.strokeWidth=broadcast?'3':'5'});box.querySelector('.vlan-routing').style.opacity=broadcast?'.15':'1';box.querySelectorAll('[data-vlan-action]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
const states=[
{fixed:[],dist:[0,'∞','∞','∞','∞','∞'],edges:[],text:'Initialisation : A = 0 ; les autres distances valent ∞. Aucun sommet fixé.'},
{fixed:['A'],dist:[0,4,2,'∞','∞','∞'],edges:['AB','AC'],text:'On fixe A (0). On propose B = 4 et C = 2 ; leur prédécesseur est A.'},
{fixed:['A','C'],dist:[0,3,2,10,12,'∞'],edges:['AC','BC','CD','CE'],text:'On fixe C (2). B : min(4, 2+1) = 3 ; D = 10 ; E = 12. Leur prédécesseur devient C.'},
{fixed:['A','C','B'],dist:[0,3,2,8,12,'∞'],edges:['AC','BC','BD','CE'],text:'On fixe B (3). D : min(10, 3+5) = 8. Le prédécesseur de D devient B.'},
{fixed:['A','C','B','D'],dist:[0,3,2,8,10,14],edges:['AC','BC','BD','DE','DF'],text:'On fixe D (8). E : min(12, 8+2) = 10 ; F = 8+6 = 14. Leur prédécesseur devient D.'},
{fixed:['A','C','B','D','E'],dist:[0,3,2,8,10,13],edges:['AC','BC','BD','DE','EF'],text:'On fixe E (10). F : min(14, 10+3) = 13. Le prédécesseur de F devient E.'},
{fixed:['A','C','B','D','E','F'],dist:[0,3,2,8,10,13],edges:['AC','BC','BD','DE','EF'],text:'On fixe F (13). Chemin A → C → B → D → E → F, coût 2+1+5+2+3 = 13.'}
];let step=0;
function updateDijkstra(){const box=document.getElementById('dijkstra-demo');if(!box)return;const s=states[step];box.querySelectorAll('[data-node]').forEach(x=>{x.style.fill=s.fixed.includes(x.dataset.node)?'#b9f0f2':'white';x.style.strokeWidth=x.dataset.node===s.fixed.at(-1)?'4':'2'});box.querySelectorAll('[data-edge]').forEach(x=>{x.style.stroke=s.edges.includes(x.dataset.edge)?'#225ce0':'#b1bfd2';x.style.strokeWidth=s.edges.includes(x.dataset.edge)?'4':'3'});document.getElementById('dijkstra-state').innerHTML='<p>'+s.text+'</p>'+table(['A','B','C','D','E','F'],[s.dist])+'<p class="caption">Sommets fixés : '+(s.fixed.join(', ')||'aucun')+'. Bleu : prédécesseurs retenus à cette étape.</p>';document.getElementById('dijkstra-counter').textContent='Étape '+step+' / 6';document.getElementById('dijkstra-prev').disabled=step===0;document.getElementById('dijkstra-next').disabled=step===6}
document.getElementById('dijkstra-prev')?.addEventListener('click',()=>{step=Math.max(0,step-1);updateDijkstra()});document.getElementById('dijkstra-next')?.addEventListener('click',()=>{step=Math.min(6,step+1);updateDijkstra()});document.getElementById('dijkstra-reset')?.addEventListener('click',()=>{step=0;updateDijkstra()});
// Explorer les questions de cours sans quitter le schéma.
const summaryTopics={
 all:{label:'Vue globale',title:'Un message, plusieurs rôles',points:[
  'Les couches répartissent les fonctions : application, transport, réseau, liaison et physique.',
  'Les ports identifient les applications ; l’IP sert au trajet entre réseaux ; la MAC sert au prochain voisin sur le lien local.',
  'Topologies, accès au canal et contrôles d’erreurs décrivent comment le réseau est construit et comment les échanges fonctionnent.'
 ],links:[['c-reperes','Message, paquet et trame'],['f-formules','Les formules'],['tp-reseau','Application dans Packet Tracer']]},
 structure:{label:'1 · Relier les équipements',title:'Le réseau donne un cadre aux échanges',points:[
  'Un réseau permet d’échanger des données et de partager des services. LAN, MAN et WAN indiquent son étendue ; client et serveur indiquent les rôles des applications.',
  'La topologie décrit les connexions : étoile, bus, anneau, maillage… Un maillage complet de n nœuds possède n(n − 1)/2 liaisons non orientées.',
  'Cuivre, fibre ou radio transportent les signaux. La forme du réseau ne suffit pas à dire comment les équipements se partagent le canal.'
 ],links:[['c-network','Réseaux, équipements et protocoles'],['c-topologies','Topologies et supports']]},
 layers:{label:'2 · Répartir les fonctions',title:'Chaque couche ajoute son rôle',points:[
  'OSI : 7 couches. TCP/IP du cours : application = OSI 5 à 7 ; transport = 4 ; Internet = 3 ; accès réseau = 1 et 2.',
  'Les ports identifient les applications, l’IP identifie la destination réseau et la MAC le voisin local. TCP donne un segment ; UDP donne un datagramme.',
  'À l’envoi, chaque couche ajoute son enveloppe : la trame contient le paquet, qui contient le segment et les données. À réception, on retire les enveloppes en sens inverse.'
 ],links:[['c-osi','Les sept couches OSI'],['c-encapsulation','Les enveloppes et leurs données'],['c-reperes','Revoir le segment, le paquet et la trame']]},
 route:{label:'3 · Atteindre la destination',title:'L’IP choisit le réseau ; la MAC vise le prochain voisin',points:[
  'IP + masque indiquent si la cible est locale. Sinon, on utilise une passerelle. ARP trouve la MAC de ce prochain voisin, pas celle d’une machine distante.',
  'Le routeur choisit le prochain lien ; Dijkstra cherche le coût minimal. Ici, sans NAT, les IP restent celles de A et B, les MAC changent et le TTL baisse.',
  'Paquet IP > MTU avec DF = 0 : fragmentation possible. Chaque fragment a son en-tête ; offset en blocs de 8 octets de données ; réassemblage à destination.'
 ],links:[['c-ipv4','IP, masque, réseau et broadcast'],['c-arp','IP, MAC et ARP'],['c-dijkstra','Dijkstra'],['c-fragmentation','MTU et fragmentation']]},
 local:{label:'4 · Utiliser le lien local',title:'Transmettre, isoler et partager',points:[
  'Ethernet transporte des trames. Le switch les dirige grâce aux MAC. Un VLAN sépare le broadcast ; un trunk porte plusieurs VLAN ; le routage relie les VLAN.',
  'Un canal partagé nécessite une règle : partage du temps, des fréquences ou des codes ; accès aléatoire ; polling. ALOHA illustre créneaux vides, succès et collisions.',
  'Slotted ALOHA : S = Np(1 − p)^(N − 1), optimum p = 1/N. Ce modèle de collisions ne décrit pas un lien Ethernet commuté en duplex intégral.'
 ],links:[['c-ethernet','Ethernet, switch et VLAN'],['c-access','Accès au canal'],['e-vlan','Refaire le TD VLAN'],['e-aloha','Refaire le TD Slotted ALOHA']]},
 errors:{label:'5 · Contrôler les données',title:'Détecter une erreur ne signifie pas toujours la corriger',points:[
  'Parité simple : détecte un nombre impair de bits modifiés. Certains codes corrigent des erreurs. FEC = correction directe ; ARQ = retransmission.',
  'Checksum : addition de mots de 16 bits, report circulaire, complément à un. Celui d’IPv4 contrôle uniquement l’en-tête du paquet.',
  'CRC : reste d’une division XOR ; le FCS Ethernet utilise ce contrôle pour la trame. Un contrôle conforme signifie « aucune erreur détectée », sans garantie absolue.'
 ],links:[['c-parity','Parité et correction directe'],['c-crc','Checksum et CRC'],['e-checksum','Refaire le checksum'],['e-crc','Refaire la division XOR']]}
};
const courseOverview=document.getElementById('course-overview');
function selectSummaryTopic(key){
 const topic=summaryTopics[key];if(!courseOverview||!topic)return;
 courseOverview.querySelector('.summary-scene').dataset.focus=key;
 courseOverview.querySelectorAll('[data-summary-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.summaryTopic===key)));
 document.getElementById('summary-detail-label').textContent=topic.label;
 document.getElementById('summary-detail-title').textContent=topic.title;
 const points=document.getElementById('summary-detail-points');points.replaceChildren();
 topic.points.forEach(text=>{const li=document.createElement('li');li.textContent=text;points.append(li)});
 const links=document.getElementById('summary-detail-links');links.replaceChildren();
 topic.links.forEach(([id,text])=>{const a=document.createElement('a');a.href='#'+id;a.textContent=text+' →';links.append(a)});
}
courseOverview?.querySelectorAll('[data-summary-topic]').forEach(button=>button.addEventListener('click',()=>{selectSummaryTopic(button.dataset.summaryTopic);document.getElementById('summary-detail').scrollIntoView({block:'start',behavior:'instant'})}));

window.addEventListener('load',()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'})),{once:true});
route();if(document.getElementById('aloha-n'))updateAloha();updateDijkstra();
if(document.modelContext?.registerTool){const life=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'calculate_fragmentation',title:'Calculer les fragments IPv4',description:'Ouvre la fiche formules et calcule les fragments visibles du paquet IPv4. DF=0 ; en-tête sans options de 20 octets.',inputSchema:{type:'object',properties:{total:{type:'integer',minimum:20,maximum:65535},mtu:{type:'integer',minimum:28,maximum:65535}},required:['total','mtu'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||Object.keys(input).some(k=>!['total','mtu'].includes(k)))throw Error('Paramètres invalides');fragment(input.total,input.mtu);document.getElementById('frag-total').value=input.total;document.getElementById('frag-mtu').value=input.mtu;location.hash='f-formules';route();const r=updateFragment(input.total,input.mtu);document.getElementById('fragment-lab').scrollIntoView();return {count:r.length,fragments:r.length<=80?r:[...r.slice(0,5),...r.slice(-3)]}}},{signal:life.signal})).catch(()=>{})}catch{}window.addEventListener('pagehide',()=>life.abort(),{once:true})}

// Aide pédagogique fondée sur l'arbitrage 11 bits + RTR du Python fourni.
const canFieldCopy={
 sof:['SOF : début de la trame','Un bit dominant 0 annonce le début d’une émission.','Il est fixé par le protocole ; tu ne le saisis pas dans le TP. L’arbitrage commence ensuite.'],
 id:['ID : identité du message et priorité','Il indique le type de message. Les applications choisissent les identifiants qui les intéressent.','Changer l’ID change le message annoncé et sa priorité. 0x100 passe avant 0x101. Cela ne change pas directement DATA.'],
 rtr:['RTR : envoyer ou demander une donnée','Data Frame : RTR = 0. Remote Frame : RTR = 1 et aucun champ DATA.','Cocher Remote Frame change RTR. À même ID, Data gagne car 0 domine 1. L’interface du TP impose aussi DLC = 0 pour Remote.'],
 control:['IDE, r0 et DLC : format et quantité de données','Dans ce TP : IDE = 0 (format standard), r0 = 0 (réservé), puis DLC sur 4 bits. Pour une Data Frame, DLC compte les octets de DATA.','Ajouter un octet fait augmenter DLC de 1 et ajoute 8 bits de données. Par exemple, 11 22 33 44 donne DLC = 4. Cela ne modifie pas la priorité.'],
 data:['DATA : le contenu utile','Ce sont les octets du message : mesure, vitesse, commande… Les applications doivent connaître leur codage.','Changer 19 en 4B fait passer notre exemple de 25 à 75 °C. Avec un octet dans les deux cas, DLC reste 1. La priorité reste fixée par ID et RTR.'],
 crc:['CRC : détecter une erreur de transmission','Le contrôleur calcule un contrôle sur les bits protégés. Les récepteurs le recalculent et comparent.','Une modification des bits protégés peut modifier le CRC calculé. Le TP affiche toujours quinze zéros : son CRC est fictif. Un contrôle conforme ne garantit pas l’absence de toute erreur.'],
 ack:['ACK : confirmer une réception au niveau CAN','Dans le slot ACK, l’émetteur laisse 1. Les récepteurs ayant validé la trame imposent 0. Le second bit est le délimiteur à 1.','ACK = 0 indique qu’au moins un récepteur a validé la trame. Cela ne prouve pas qu’une commande a été exécutée. Le TP fixe le slot à 1 et ne simule pas l’acquittement.'],
 eof:['EOF : terminer la trame','Sept bits récessifs 1 marquent la fin. Ensuite, trois bits d’intermission séparent les trames.','Ces champs sont fixés par le protocole. Le bus ne devient pas disponible dès l’ACK. L’intermission n’est pas incluse dans la longueur affichée du TP.']
};
document.querySelectorAll('[data-can-field]').forEach(button=>button.addEventListener('click',()=>{
 const copy=canFieldCopy[button.dataset.canField];
 document.querySelectorAll('[data-can-field]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
 document.getElementById('can-field-title').textContent=copy[0];
 document.getElementById('can-field-role').textContent=copy[1];
 document.getElementById('can-field-change').textContent=copy[2];
}));
function parseCANNode(idText,dataText,remote){
 const text=idText.trim().replace(/^0x/i,'');
 if(!/^[0-9a-f]{1,3}$/i.test(text)||parseInt(text,16)>0x7ff)throw Error('ID : entre un nombre hexadécimal de 000 à 7FF (11 bits).');
 const id=parseInt(text,16),parts=dataText.trim()?dataText.trim().split(/\s+/):[];
 if(!remote&&(parts.length>8||!parts.every(x=>/^(?:0x)?[0-9a-f]{1,2}$/i.test(x))))throw Error('DATA : entre au maximum 8 octets hexadécimaux de 00 à FF, séparés par des espaces.');
 const data=remote?[]:parts.map(x=>parseInt(x.replace(/^0x/i,''),16));
 return {id,remote,data,dlc:data.length,bits:id.toString(2).padStart(11,'0')+(remote?'1':'0')};
}
function compareCAN(a,b){
 const first=[...a.bits].findIndex((bit,i)=>bit!==b.bits[i]);
 if(first===-1)return {winner:null,first:null,bus:a.bits};
 return {winner:a.bits[first]==='0'?1:2,first,bus:[...a.bits].slice(0,first+1).map((bit,i)=>String(Number(bit)&Number(b.bits[i]))).join('')};
}
function updateCAN(){
 const result=document.getElementById('can-result');if(!result)return;
 for(const n of [1,2])document.getElementById('can-data-'+n).disabled=document.getElementById('can-remote-'+n).checked;
 try{
  const a=parseCANNode(document.getElementById('can-id-1').value,document.getElementById('can-data-1').value,document.getElementById('can-remote-1').checked);
  const b=parseCANNode(document.getElementById('can-id-2').value,document.getElementById('can-data-2').value,document.getElementById('can-remote-2').checked);
  const r=compareCAN(a,b),id=n=>'0x'+n.toString(16).toUpperCase().padStart(3,'0');
  let explanation;
  if(r.winner){
   const winner=r.winner===1?a:b,loser=r.winner===1?b:a;
   explanation='<div class="result"><strong>Nœud '+r.winner+' gagne : '+id(winner.id)+'</strong><br>'+(r.first===11?'Les ID sont identiques. Au bit 12 (RTR), la Data Frame envoie 0 et la Remote Frame envoie 1.':'Premier désaccord au bit '+(r.first+1)+' du journal (ID'+(10-r.first)+'). Le plus petit ID vaut '+winner.id+' en décimal, contre '+loser.id+'.')+' Le gagnant envoie 0 ; l’autre envoie 1, lit 0 et se retire.</div>';
  }else{
   const differentData=a.data.join(',')!==b.data.join(',');
   explanation='<div class="result"><strong>Égalité pendant l’arbitrage : même ID et même RTR.</strong><br>'+(!a.remote&&differentData?'Les DATA diffèrent : elles ne départagent pas les nœuds pendant l’arbitrage. Sur un vrai bus, cette divergence peut déclencher une erreur. Le Python fourni retourne le premier nœud sans détecter ce conflit.':'Aucun gagnant unique n’est déterminé par ces champs. Le Python fourni retourne le premier nœud ; cela ne lui donne pas une priorité supérieure.')+'</div>';
  }
  const cells=bits=>Array.from({length:12},(_,i)=>'<td'+(i===r.first?' class="can-deciding"':'')+'>'+esc(r.first!==null&&i>r.first?'—':(bits[i]??'—'))+'</td>').join('');
  const bitTable='<div class="table-wrap can-bit-table" tabindex="0" role="region" aria-label="Comparaison des 11 bits ID puis RTR"><table><thead><tr><th>Champ</th>'+Array.from({length:12},(_,i)=>'<th>'+(i===11?'RTR':'ID'+(10-i))+'</th>').join('')+'</tr></thead><tbody><tr><th>Nœud 1</th>'+cells(a.bits)+'</tr><tr><th>Nœud 2</th>'+cells(b.bits)+'</tr><tr><th>Bus jusqu’au départage</th>'+cells(r.bus,true)+'</tr></tbody></table></div>';
  const summary=table(['Nœud','ID hex → décimal','Type','DLC','Longueur affichée dans le TP'],[a,b].map((x,i)=>[i+1,id(x.id)+' → '+x.id,x.remote?'Remote':'Data',x.dlc,(44+8*x.dlc)+' bits']));
  result.innerHTML=explanation+bitTable+(r.first!==null?'<p class="caption">La colonne colorée est le premier désaccord. Après elle, le perdant n’émet plus ; les tirets arrêtent donc la comparaison.</p>':'')+summary+'<p class="caption">DATA change le contenu et éventuellement DLC et la longueur. ID et RTR décident de l’arbitrage. Pour Remote, les données saisies sont ignorées.</p>';
 }catch(e){error(result,e.message)}
}
const canPresets={
 voisins:{ids:['100','101'],data:['11 22 33 44','AA BB'],remote:[false,false],note:'Essai 1 : seuls les derniers bits des ID diffèrent. Les DATA contiennent 4 octets pour le nœud 1 et 2 pour le nœud 2.'},
 data:{ids:['100','101'],data:['FF','00 00 00 00 00 00 00 00'],remote:[false,false],note:'Essai 2 : mêmes ID que l’essai 1, nouvelles DATA. Nœud 1 garde la priorité ; DLC et les longueurs changent.'},
 remote:{ids:['100','100'],data:['11 22 33 44','AA BB'],remote:[true,false],note:'Essai 3 : les ID sont égaux. Nœud 1 demande la donnée (Remote) ; nœud 2 la transmet (Data). RTR départage les deux.'},
 priority:{ids:['101','100'],data:['11 22 33 44','AA BB'],remote:[false,false],note:'Essai 4 : les ID de l’essai 1 sont inversés, les DATA restent les mêmes. La priorité passe au nœud 2.'}
};
document.querySelectorAll('[data-can-preset]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-can-preset]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
 const p=canPresets[button.dataset.canPreset];
 [1,2].forEach((n,i)=>{document.getElementById('can-id-'+n).value=p.ids[i];document.getElementById('can-data-'+n).value=p.data[i];document.getElementById('can-remote-'+n).checked=p.remote[i]});
 document.getElementById('can-preset-note').textContent=p.note;updateCAN();
}));
document.getElementById('can-form')?.addEventListener('submit',e=>{e.preventDefault();updateCAN()});
document.getElementById('can-form')?.addEventListener('input',()=>{document.querySelectorAll('[data-can-preset]').forEach(x=>x.setAttribute('aria-pressed','false'));document.getElementById('can-preset-note').textContent='Essai libre : change un seul réglage, puis compare le gagnant, le bit de départage et DLC.';updateCAN()});
updateCAN();
function updateCANLength(){
 const input=document.getElementById('can-size-dlc');if(!input)return;
 const n=Number(input.value),result=document.getElementById('can-length-result');
 if(input.value===''||!Number.isInteger(n)||n<0||n>8){result.textContent='Choisis un nombre entier d’octets de 0 à 8.';return}
 result.textContent='44 bits fixes + '+n+' × 8 bits de données = '+(44+8*n)+' bits affichés dans le TP. Le CRC est déjà dans les 44 bits.';
 document.getElementById('can-fixed-size').style.flex='44';
 const data=document.getElementById('can-data-size');data.hidden=n===0;data.style.flex=String(8*n);data.textContent=(8*n)+' bits DATA';
}
document.getElementById('can-size-dlc')?.addEventListener('input',updateCANLength);updateCANLength();
const canStoryCopy={
 bus:'Tous les nœuds partagent le bus. Une trame émise est observable par tous les récepteurs ; leurs applications ne conservent que les messages qui les intéressent.',
 prepare:'Chaque capteur prépare un message : un ID pour annoncer le type de mesure, des octets DATA pour sa valeur. Le contrôleur ajoute les champs du protocole. Le bus doit être disponible pour commencer.',
 arbitrate:'A, B et C commencent ensemble. Leurs ID sont comparés bit par bit : 0 domine 1. B, avec 0x080 (128), gagne contre 0x120 (288) et 0x150 (336). A et C arrêtent d’émettre et écoutent.',
 send:'B continue et transmet sa mesure. Les récepteurs vérifient la trame et l’acquittent. Après la fin et l’intermission, A et C peuvent réessayer. L’application de D utilise le message si son ID l’intéresse.'
};
document.querySelectorAll('[data-can-story]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-can-story]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
 document.getElementById('can-story-explanation').textContent=canStoryCopy[button.dataset.canStory];
 document.querySelectorAll('[data-can-node]').forEach(x=>{const active=['arbitrate','send'].includes(button.dataset.canStory)&&x.dataset.canNode==='b';x.setAttribute('fill',active?'#d8f1e8':'#f4f8fc');x.setAttribute('stroke',active?'#27846e':'#c1d1e4')});
}));

function capteurBilan(n,inRange,cycles,received){
 if(![n,inRange,cycles,received].every(Number.isInteger)||n<1||n>200||inRange<0||inRange>n||cycles<1||cycles>50||received<0||received>inRange*cycles)throw Error('Choisis N de 1 à 200, un nombre en portée entre 0 et N, 1 à 50 cycles, et des reçus entre 0 et le nombre de paquets envoyés.');
 const produced=n*cycles,sent=inRange*cycles;
 return {produced,sent,pdr:sent?100*received/sent:null,delivery:100*received/produced,energy:100-.5*received/n,expected:.9*sent};
}
function updateCapteurBilan(){
 const el=document.getElementById('capteur-result');if(!el)return;
 try{
  const n=Number(document.getElementById('cap-n').value),inRange=Number(document.getElementById('cap-range').value),cycles=Number(document.getElementById('cap-cycles').value),rx=Number(document.getElementById('cap-received').value),r=capteurBilan(n,inRange,cycles,rx),f=x=>x.toLocaleString('fr-FR',{maximumFractionDigits:2});
  el.innerHTML='<div class="result"><strong>Mesures produites :</strong> '+n+' × '+cycles+' = '+r.produced+'<br><strong>Paquets envoyés :</strong> '+inRange+' × '+cycles+' = '+r.sent+'<br><strong>PDR :</strong> '+(r.pdr===null?'non calculable : aucun paquet envoyé':rx+' ÷ '+r.sent+' × 100 = '+f(r.pdr)+' %')+'<br><strong>Part de toutes les mesures reçues :</strong> '+rx+' ÷ '+r.produced+' × 100 = '+f(r.delivery)+' %<br><strong>Réserve moyenne restante :</strong> 100 − (0,5 × '+rx+' ÷ '+n+') = '+f(r.energy)+' %</div><p class="caption">Avec 10 % de pertes aléatoires, la moyenne théorique des reçus est 0,9 × '+r.sent+' = '+f(r.expected)+'. Le résultat d’un essai peut être différent. L’énergie moyenne inclut les '+n+' capteurs, même hors de portée.</p>';
 }catch(e){error(el,e.message)}
}
document.getElementById('capteur-form')?.addEventListener('submit',e=>{e.preventDefault();updateCapteurBilan()});
document.getElementById('capteur-form')?.addEventListener('input',updateCapteurBilan);
document.getElementById('cap-case50')?.addEventListener('click',()=>{for(const [id,value] of [['cap-n',50],['cap-range',47],['cap-cycles',50],['cap-received',2117]])document.getElementById(id).value=value;updateCapteurBilan()});
updateCapteurBilan();
function capteurDistance(x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>100||y<0||y>100)throw Error('Entre x et y entre 0 et 100, dans le carré de l’usine.');
 return Math.hypot(x-50,y-50);
}
function updateCapteurDistance(){
 const el=document.getElementById('cap-distance-result');if(!el)return;
 try{
  const xText=document.getElementById('cap-x').value,yText=document.getElementById('cap-y').value;if(!xText||!yText)throw Error('Renseigne les deux coordonnées.');
  const x=Number(xText),y=Number(yText),d=capteurDistance(x,y),inside=d<=60,f=v=>v.toLocaleString('fr-FR',{maximumFractionDigits:2});
  el.innerHTML='<div class="result"><strong>d = √[('+f(x)+' − 50)² + ('+f(y)+' − 50)²] = '+f(d)+'</strong><br>'+ (inside?'Distance ≤ 60 : capteur en portée. Il peut tenter l’envoi ; il reste 10 % de risque de perte.':'Distance > 60 : capteur hors portée. Sa mesure n’est pas envoyée ; elle n’entre pas dans le dénominateur du PDR.')+'</div>';
  const px=70+2.6*x,py=30+2.6*(100-y),dot=document.getElementById('cap-distance-dot'),line=document.getElementById('cap-distance-line');dot.setAttribute('cx',px);dot.setAttribute('cy',py);dot.setAttribute('fill',inside?'#248063':'#b57237');line.setAttribute('x2',px);line.setAttribute('y2',py);
 }catch(e){error(el,e.message)}
}
document.getElementById('cap-distance-form')?.addEventListener('submit',e=>{e.preventDefault();updateCapteurDistance()});
document.getElementById('cap-distance-form')?.addEventListener('input',updateCapteurDistance);
document.getElementById('cap-corner')?.addEventListener('click',()=>{document.getElementById('cap-x').value=0;document.getElementById('cap-y').value=0;updateCapteurDistance()});
updateCapteurDistance();
// Corrections du QCM affichées seulement après une tentative.
const td2Quiz=document.getElementById('td2-quiz-form');
td2Quiz?.addEventListener('submit',e=>{
 e.preventDefault();let answered=0,correct=0;
 td2Quiz.querySelectorAll('[data-quiz-answer]').forEach(card=>{
  const choice=card.querySelector('input:checked'),feedback=card.querySelector('.quiz-feedback');
  feedback.hidden=false;
  if(!choice){feedback.className='quiz-feedback quiz-pending';feedback.textContent='Choisis une réponse, puis vérifie à nouveau.';return}
  answered++;const success=choice.value===card.dataset.quizAnswer;if(success)correct++;
  feedback.className='quiz-feedback '+(success?'quiz-correct':'quiz-retry');
  feedback.textContent=(success?'Correct. ':'À revoir. ')+card.dataset.quizExplanation;
 });
 const count=td2Quiz.querySelectorAll('[data-quiz-answer]').length;
 document.getElementById('td2-quiz-score').textContent=correct+' réponse'+(correct>1?'s':'')+' correcte'+(correct>1?'s':'')+' sur '+answered+' répondue'+(answered>1?'s':'')+' ; '+(count-answered)+' question'+(count-answered>1?'s':'')+' restante'+(count-answered>1?'s':'')+'. Lis les calculs sous chaque question.';
});
document.getElementById('td2-quiz-reset')?.addEventListener('click',()=>{td2Quiz.reset();td2Quiz.querySelectorAll('.quiz-feedback').forEach(x=>{x.hidden=true;x.textContent=''});document.getElementById('td2-quiz-score').textContent='Nouvel essai : choisis tes réponses, puis vérifie.'});
