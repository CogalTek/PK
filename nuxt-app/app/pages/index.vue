<template>
    <div class="d-flex flex-column align-center justify-center" style="height: 80vh;">
		<h1 class="text-h2 mb-4" id="titre">PK</h1>

		<v-btn id="buttonSpaceBar" style="width: 20%;">
			<span style="z-index: 2;" id="text_press">Presse espace</span>
            <div id="wall"></div>
		</v-btn>
	</div>
</template>

<script setup>
    const router = useRouter()
    const spacePressed = ref(false)
    let loopId = null

    definePageMeta({
        pageTransition: { name: 'slide', mode: 'out-in' }
    })

    onMounted(async () => {
        const button = document.getElementById('buttonSpaceBar')

        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !spacePressed.value) {
                spacePressed.value = true
                button.classList.add('pressed')
                startLoop()
            }
        }

        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                spacePressed.value = false
                button.classList.remove('pressed')
                stopLoop()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        onBeforeUnmount(() => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            stopLoop()
        })
    })

    function addletter() {
        const textElement = document.getElementById('titre')
        const titre = "Paketekhouse"
        for (let i = 0; i < titre.length; i++) {
            setTimeout(() => {
                textElement.textContent = titre.slice(0, i + 1)
            }, i * 150)
        }

        setTimeout(() => {
            document.body.style.cursor = 'auto'
            // Rediriger vers la page de login Kinde
            navigateTo('/api/login', { external: true })
        }, 3000)
    }

    function animateConnection() {
        setTimeout(() => {
            const button = document.getElementById('buttonSpaceBar')
            const text = document.getElementById('text_press')

            button.style.width = (parseFloat(button.style.width) || 0) + 2 + '%'
            button.style.height = '50px'

            setTimeout(() => {
                text.style.display = 'none'
                button.style.width = '0px'
                button.style.height = '0px'

                setTimeout(() => {
                    button.style.display = 'none'
                    addletter()
                }, 999)
            }, 1000)
        }, 1000)
    }


    function startLoop() {
        const loop = () => {
            if (!spacePressed.value) return
            // 👉 ici tu mets ton code qui doit tourner tant que la touche est maintenue
            if (parseFloat(document.getElementById('wall').style.width) >= 100) {
                stopLoop()
                animateConnection()
                return
            } 
            document.getElementById('wall').style.width = (parseFloat(document.getElementById('wall').style.width) || 0) + 1 + '%'
            loopId = requestAnimationFrame(loop)
        }
        loop()
    }

    function stopLoop() {
        if (loopId) {
            cancelAnimationFrame(loopId)
            loopId = null
        }
    }
</script>

<style scoped>
    body {
        cursor: none;
    }

    #buttonSpaceBar.pressed {
        background-color: rgba(255, 255, 255, 0.377);
    }

    #buttonSpaceBar {
        height: 40px;
        position: relative;
        overflow: hidden;
        transition: 1s all ease;
    }

    #wall {
        background-color: rgb(155, 26, 123);
        height: 100%;
        width: 0%;
        position: absolute;
        left: 0;
        border-radius: 4px;
        z-index: 0;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: transform .45s cubic-bezier(.4,0,.2,1), opacity .45s;
    }
    .slide-enter-from,
    .slide-leave-to {
        opacity: 0;
        transform: translateX(24px);
    }

</style>
