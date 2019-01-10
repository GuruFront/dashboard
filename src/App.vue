<template>
    <div id="app">
        <div class="row m-0">
            <div class="col-3" id="list">
                <ul class="test-list">
                    <li id="ball">Widget 1</li>
                    <li>Widget 2</li>
                </ul>
            </div>
            <dnd-grid-container
                    class="col-9 p-0"
                    id="dashboard"
                    :layout.sync="layout"
                    :cellSize="cellSize"
                    :maxColumnCount="maxColumnCount"
                    :maxRowCount="maxRowCount"
                    :margin="margin"
                    :bubbleUp="bubbleUp">
                <!--<dnd-grid-box-->
                <!--boxId="settings"-->
                <!--dragSelector=".demo-box">-->
                <!--<div class="card demo-box">-->
                <!--<div class="card-header">-->
                <!--Settings-->
                <!--</div>-->
                <!--<div class="card-body">-->
                <!--<div class="form-group row">-->
                <!--<label for="settings-margin-input" class="col-sm-4 col-form-label">Margin</label>-->
                <!--<div class="col-sm-8">-->
                <!--<input class="form-control" type="number" v-model.number="margin"-->
                <!--id="settings-margin-input">-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="form-group row">-->
                <!--<label for="settings-grid-size-w-input" class="col-sm-4 col-form-label">Cell Size</label>-->
                <!--<div class="col-sm-4">-->
                <!--<input class="form-control" type="number" v-model.number="cellSize.w"-->
                <!--id="settings-grid-size-w-input">-->
                <!--</div>-->
                <!--<div class="col-sm-4">-->
                <!--<input class="form-control" type="number" v-model.number="cellSize.h">-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="form-group row">-->
                <!--<label for="settings-bubble-up-input" class="col-sm-4 col-form-label">Bubble Up</label>-->
                <!--<div class="col-sm-8">-->
                <!--<input type="checkbox" v-model="bubbleUp" id="settings-bubble-up-input">-->
                <!--</div>-->
                <!--</div>-->
                <!--<button class="btn btn-success" @click="boxCount++">Add Box</button>-->
                <!--<button class="btn btn-danger" @click="boxCount = Math.max(0, boxCount-1)">Remove Box</button>-->
                <!--</div>-->
                <!--</div>-->
                <!--</dnd-grid-box>-->

                <dnd-grid-box
                        v-for="number in boxCount"
                        :boxId="number"
                        :key="number"
                        dragSelector=".demo-box">
                    <div class="card demo-box">
                        Widget {{ number }}
                    </div>
                </dnd-grid-box>
            </dnd-grid-container>
        </div>
    </div>
</template>

<script>
    import {Box, Container} from '@dattn/dnd-grid'
    import '@dattn/dnd-grid/dist/dnd-grid.css'

    export default {
        components: {
            DndGridContainer: Container,
            DndGridBox: Box
        },
        data() {
            return {
                cellSize: {
                    w: 100,
                    h: 100
                },
                maxColumnCount: 10,
                maxRowCount: Infinity,
                bubbleUp: false,
                margin: 5,
                boxCount: 1,
                layout: [
                    {
                        id: 'settings',
                        hidden: false,
                        pinned: false,
                        position: {
                            x: 0,
                            y: 0,
                            w: 4,
                            h: 3
                        }
                    }
                ]
            }
        },
        computed: {
            layoutWithoutSettings() {
                return this.layout.filter((box) => {
                    return box.id !== 'settings'
                })
            }
        },
        methods: {
            onLayoutUpdate(evt) {
                this.layout = evt.layout;
                console.log(this.layout);
            }
        }
    }


    document.addEventListener("DOMContentLoaded", function () {
        var ball = document.getElementById('ball');

        ball.onmousedown = function (e) { // 1. отследить нажатие
            // подготовить к перемещению
            // 2. разместить на том же месте, но в абсолютных координатах
            ball.style.position = 'absolute';
            moveAt(e);
            // переместим в body, чтобы мяч был точно не внутри position:relative
            document.body.appendChild(ball);

            ball.style.zIndex = 1000; // показывать мяч над другими элементами

            // передвинуть мяч под координаты курсора
            // и сдвинуть на половину ширины/высоты для центрирования
            function moveAt(e) {
                ball.style.left = e.pageX - ball.offsetWidth / 2 + 'px';
                ball.style.top = e.pageY - ball.offsetHeight / 2 + 'px';
            }

            // 3, перемещать по экрану
            document.onmousemove = function (e) {
                moveAt(e);
            };

            // 4. отследить окончание переноса
            var dashboard = document.getElementById('dashboard');


            var overDashboard = true;


            ball.onmouseup = function () {
                if (overDashboard) {
                    document.onmousemove = null;
                    ball.onmouseup = null;

                } else {
                    ball.style.position = 'static';
                    document.onmousemove = null;
                    ball.onmouseup = null;
                }
            }

        }
    });
</script>

<style lang="scss">
    .test-list {
        cursor: pointer;
        border: 1px solid red;
        list-style: none;
        margin: 0;
    }

    .dnd-grid-container {
        border: 1px solid red;
    }

    .card.demo-box {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
