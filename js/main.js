!function(){var a={},b=[],c=new Image,d=new Image,e=new Image,f=7,g=0,h=document.getElementById("game"),i=document.createElement("canvas"),j=i.getContext("2d"),k=7,l=30,m=window.innerWidth,n=window.innerHeight,o=0,p=1e3/30,q=Math.floor(n/k),r=0,s=0,t=1,u=15,v=new Date,w=new Date,x=100,y=[],z=[],A=[],B=function(a,b,c,d){return c<a+q&&c>a&&d<b+q&&d>=b},C=function(){$.getJSON("https://tismas.github.io/data/heroes.json",function(b){$.each(b,function(b,c){a[b]=c}),G(),D()}).fail(function(){console.log("Failed to load json")})},D=function(){c.onload=G,c.src="assets/background.png";for(var f=0;f<3;f++)b.push(new Image),b[f].onload=G,b[f].src="assets/"+(f+1)+".png";a.knight.image=b,d.onload=G,d.src="assets/hp.png",e.onload=G,e.src="assets/moneta1.png",E()},E=function(){i.width=m,i.height=n,h.appendChild(i),A.push(new I(0*q,0,a.knight,F)),window.onresize=H,M(),P()};C();var F=function(b,c){this.x=b,this.y=c,this.hp=a.knight.hp,this.maxhp=a.knight.hp,this.dmg=a.knight.dmg,this.speed=a.knight.speed,this.reward=a.knight.reward,this.attackCooldown=20,this.timeToAttack=0,this.image=a.knight.image,this.moving=!0,this.frame=0,this.frameTime=5,this.frameCnt=0,this.frames=3,this.attack=function(a){0==this.timeToAttack&&this.hp>0&&(this.timeToAttack=this.attackCooldown,a.hp-=this.dmg,a.hp<=0&&z.indexOf(a)!=-1&&(x+=a.reward))},this.die=function(){var a=y.indexOf(this);a!=-1?y.splice(a,1):(a=z.indexOf(this),z.splice(a,1))},this.draw=function(){var a=j.createLinearGradient(this.x-o,this.y,this.x-o,this.y+20);a.addColorStop(.01,"black"),a.addColorStop(.5,"rgb("+(this.maxhp-this.hp)/this.maxhp*255+","+this.hp/this.maxhp*255+",50)"),a.addColorStop(.99,"black"),j.fillStyle=a,z.indexOf(this)!=-1?(j.save(),j.translate(this.x,this.y),j.scale(-1,1),j.translate(this.x,-this.y),j.drawImage(this.image[this.frame],-(this.x-o+q/4),this.y+q/4,q,q),j.fillRect(-(this.x-o)-q/5,this.y,this.hp/this.maxhp*(.75*q),20),j.drawImage(d,-(this.x-o)-q/5,this.y,.75*q,20),j.restore()):(j.drawImage(this.image[this.frame],this.x-o+q/4,this.y+q/4,q,q),j.fillRect(-o+this.x+q/3,this.y,this.hp/this.maxhp*(.75*q),20),j.drawImage(d,-o+this.x+q/3,this.y,.75*q,20)),j.fillStyle="#0f0"},this.update=function(){0!=this.timeToAttack&&this.timeToAttack--,(this.hp<=0||this.x>=l*q||this.x<0)&&this.die(),this.moving?(this.frameCnt++,this.frameCnt>=this.frameTime&&(this.frame++,this.frameCnt=0,this.frame==this.frames&&(this.frame=1))):this.frame=0}},G=function(){g++,console.log("Files loaded: "+g+"/"+f)},H=function(){m=window.innerWidth,n=window.innerHeight,i.width=m,i.height=n;var a=q;q=Math.floor(n/k);for(var b=0;b<A.length;b++)A[b].x=b*q;for(var b=0;b<y.length;b++){var c=y[b].x/a;y[b].x=c*q}for(var b=0;b<z.length;b++){var c=z[b].x/a;z[b].x=c*q}M(),P()};i.onmousemove=function(a){r=a.x,s=a.y},i.onclick=function(a){a.x<=q&&a.y>=q&&(t=Math.floor(s/q),t>=k&&(t=heighT-1));for(var b=0;b<A.length;b++)A[b].collide(a.x,a.y)&&x>=A[b].cost?A[b].success():A[b].collide(a.x,a.y)&&A[b].fail()};var I=function(a,b,c,d,e,f){this.x=a,this.y=b,this.color=c.color,this.cost=c.price,this.background=e||"#333",this.hover=f||"#555",this.failed=!1,this.succeed=!1,this.statusCounter=0,this.fail=function(){this.failed=!0,this.statusCounter=5},this.success=function(){this.succeed=!0,x-=this.cost,this.statusCounter=5,y.push(new d(0,t*q))},this.collide=function(a,b){return B(this.x,this.y,a,b)},this.draw=function(){this.failed?j.fillStyle="#500":this.succeed?j.fillStyle="#050":B(a,b,r,s)?j.fillStyle=this.hover:j.fillStyle=this.background,j.fillRect(this.x,this.y,q,q),j.drawImage(c.image[0],this.x+q/5,this.y+q/10,q-2*q/5,q-2*q/5),j.fillStyle="#fff",j.font="20px Arial";var d="$"+this.cost;j.fillText(d,this.x+q-q/2-j.measureText(d).width/2,this.y+q-15),this.statusCounter>0?this.statusCounter--:(this.failed||this.succeed)&&(this.failed=!1,this.succeed=!1)}},J=function(){r<=q&&o>0?o-=u:r>=m-q&&o<l*q-m&&(o+=u)},K=function(){for(var a=0;a<y.length;a++){for(var b=!0,c=null,d=0;d<y.length;d++)if(a!=d&&B(y[a].x,y[a].y,y[d].x,y[d].y)&&y[a].x<y[d].x){b=!1,y[a].moving=!1;break}for(var d=0;d<z.length;d++)if(B(y[a].x,y[a].y,z[d].x-q,z[d].y)){b=!1,y[a].moving=!1,c=z[d];break}b?(y[a].x+=y[a].speed,y[a].moving=!0):null!=c&&y[a].attack(c),y[a].update()}},L=function(){for(var a=0;a<z.length;a++){for(var b=!0,c=null,d=0;d<z.length;d++)if(a!=d&&B(z[d].x,z[d].y,z[a].x,z[a].y)&&z[a].x>z[d].x){b=!1,z[a].moving=!1;break}for(var d=0;d<y.length;d++)if(B(y[d].x,y[d].y,z[a].x-q,z[a].y)){b=!1,z[a].moving=!1,c=y[d];break}b?(z[a].x-=z[a].speed,z[a].moving=!0):null!=c&&z[a].attack(c),z[a].update()}},M=function(){v=new Date;var a=v-w;if(a>p){for(J();a>p;){var b=Math.floor(300*Math.random());1==b&&z.push(new F(l*q,q*(Math.floor(5*Math.random())+1))),K(),L(),a-=p}w=v}requestAnimationFrame(P)},N=function(){j.fillStyle="#fff",j.fillRect(0,0,m,1),j.fillRect(0,0,2,q),j.fillRect(0,q,m,1),j.fillRect(m-1,0,1,q);var a=Math.round(m/2/q)-1;j.fillRect(q*a,0,1,q),j.fillRect(q*(a+1),0,1,q)},O=function(){j.fillStyle="#000",j.fillRect(0,0,q*l,q);for(var a=0;a<A.length;a++)A[a].draw();j.font="20px Arial",j.fillStyle="#fff";var b=Math.round(m/2/q)-1;j.drawImage(e,q*b+10,q/6,q/5,q/5),j.fillText(x,q*b+q/5+10,q/6+20),N()},P=function(){j.fillStyle="#000",j.fillRect(0,0,i.width,i.height),j.drawImage(c,-o,q,l*q,n-q);var a=j.createLinearGradient(-o-q/8,0,q,0);a.addColorStop(0,"yellow"),a.addColorStop(.5,"transparent");var b=j.createLinearGradient(-o-q/8,0,q,0);if(b.addColorStop(0,"blue"),b.addColorStop(.5,"transparent"),j.fillStyle=a,j.fillRect(-o,q*t,q,q),r<=q&&s>=q){var d=Math.floor(s/q);d<k&&d!=t&&(j.fillStyle=b,j.fillRect(-o,d*q,q,q))}for(var e=0;e<y.length;e++)y[e].draw();for(var e=0;e<z.length;e++)z[e].draw();O(),setTimeout(M,p)}}();