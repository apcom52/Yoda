!function(t){"use strict";t.Plugin.KineticScrolling=function(i,e){t.Plugin.call(this,i,e),this.dragging=!1,this.timestamp=0,this.callbackID=0,this.targetX=0,this.targetY=0,this.autoScrollX=!1,this.autoScrollY=!1,this.startX=0,this.startY=0,this.velocityX=0,this.velocityY=0,this.amplitudeX=0,this.amplitudeY=0,this.directionWheel=0,this.velocityWheelX=0,this.velocityWheelY=0,this.settings={kineticMovement:!0,timeConstantScroll:325,horizontalScroll:!0,verticalScroll:!1,horizontalWheel:!0,verticalWheel:!1,deltaWheel:40}},t.Plugin.KineticScrolling.prototype=Object.create(t.Plugin.prototype),t.Plugin.KineticScrolling.prototype.constructor=t.Plugin.KineticScrolling,t.Plugin.KineticScrolling.prototype.configure=function(t){if(t)for(var i in t)this.settings.hasOwnProperty(i)&&(this.settings[i]=t[i])},t.Plugin.KineticScrolling.prototype.start=function(){this.game.input.onDown.add(this.beginMove,this),this.callbackID=this.game.input.addMoveCallback(this.moveCamera,this),this.game.input.onUp.add(this.endMove,this),this.game.input.mouse.mouseWheelCallback=this.mouseWheel.bind(this)},t.Plugin.KineticScrolling.prototype.beginMove=function(){this.startX=this.game.input.x,this.startY=this.game.input.y,this.dragging=!0,this.timestamp=Date.now(),this.velocityY=this.amplitudeY=this.velocityX=this.amplitudeX=0},t.Plugin.KineticScrolling.prototype.moveCamera=function(t,i,e){if(this.dragging){this.now=Date.now();var s=this.now-this.timestamp;if(this.timestamp=this.now,this.settings.horizontalScroll){var h=i-this.startX;this.startX=i,this.velocityX=.8*(1e3*h/(1+s))+.2*this.velocityX,this.game.camera.x-=h}if(this.settings.verticalScroll){var h=e-this.startY;this.startY=e,this.velocityY=.8*(1e3*h/(1+s))+.2*this.velocityY,this.game.camera.y-=h}}},t.Plugin.KineticScrolling.prototype.endMove=function(){this.dragging=!1,this.autoScrollX=!1,this.autoScrollY=!1,this.settings.kineticMovement&&(this.now=Date.now(),this.game.input.activePointer.withinGame&&(this.velocityX>10||this.velocityX<-10)&&(this.amplitudeX=.8*this.velocityX,this.targetX=Math.round(this.game.camera.x-this.amplitudeX),this.autoScrollX=!0),this.game.input.activePointer.withinGame&&(this.velocityY>10||this.velocityY<-10)&&(this.amplitudeY=.8*this.velocityY,this.targetY=Math.round(this.game.camera.y-this.amplitudeY),this.autoScrollY=!0),this.game.input.activePointer.withinGame||(this.settings.horizontalScroll&&(this.autoScrollX=!0),this.settings.verticalScroll&&(this.autoScrollY=!0)))},t.Plugin.KineticScrolling.prototype.update=function(){if(this.elapsed=Date.now()-this.timestamp,this.autoScrollX&&0!=this.amplitudeX){var t=-this.amplitudeX*Math.exp(-this.elapsed/this.settings.timeConstantScroll);t>.5||-.5>t?this.game.camera.x=this.targetX-t:(this.autoScrollX=!1,this.game.camera.x=this.targetX)}if(this.autoScrollY&&0!=this.amplitudeY){var t=-this.amplitudeY*Math.exp(-this.elapsed/this.settings.timeConstantScroll);t>.5||-.5>t?this.game.camera.y=this.targetY-t:(this.autoScrollY=!1,this.game.camera.y=this.targetY)}this.settings.horizontalWheel&&(this.velocityWheelX<-.1||this.velocityWheelX>.1||!this.game.input.activePointer.withinGame)&&(this.game.camera.x-=this.velocityWheelX,this.velocityWheelX*=.95),this.settings.verticalWheel&&(this.velocityWheelY<-.1||this.velocityWheelY>.1||!this.game.input.activePointer.withinGame)&&(this.game.camera.y-=this.velocityWheelY,this.velocityWheelY*=.95)},t.Plugin.KineticScrolling.prototype.mouseWheel=function(t){if(this.settings.horizontalWheel||this.settings.verticalWheel){t.preventDefault();var i=120*this.game.input.mouse.wheelDelta/this.settings.deltaWheel;this.directionWheel!=this.game.input.mouse.wheelDelta&&(this.velocityWheelX=0,this.velocityWheelY=0,this.directionWheel=this.game.input.mouse.wheelDelta),this.settings.horizontalWheel&&(this.autoScrollX=!1,this.velocityWheelX+=i),this.settings.verticalWheel&&(this.autoScrollY=!1,this.velocityWheelY+=i)}},t.Plugin.KineticScrolling.prototype.stop=function(){this.game.input.onDown.remove(this.beginMove,this),this.callbackID?this.game.input.deleteMoveCallback(this.callbackID):this.game.input.deleteMoveCallback(this.moveCamera,this),this.game.input.onUp.remove(this.endMove,this),this.game.input.mouse.mouseWheelCallback=null}}(Phaser);