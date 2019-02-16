<template>
    <div class="playlist-sorter">
        <a class="playlist-controls-item button button-alt" @click="onRandomClick">
            <i class="fa fa-random"></i>
        </a>
        <a class="playlist-controls-item button button-alt" @click="onSortChange">
            <i class="fa fa-sort-amount-down" v-if="sortDesc"></i>
            <i class="fa fa-sort-amount-up" v-if="!sortDesc"></i>
        </a>
        <div class="sorter-dropdown">
            <a class="playlist-controls-item button button-alt" @click="showDropdown = !showDropdown" ref="dropdownToggle">
                <span class="sort-value">{{ selected.label }}</span>
                <i class="fa fa-caret-down"></i>
            </a>
            <ul v-show="showDropdown" ref="dropdownMenu">
                <li v-for="option in options" @click="onSelect(option)"
                    :class="{selected: selected.value === option.value}">{{ option.label }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import events from '../../events';

    export default {
        props: [],
        name: "Sorter",
        data() {
            return {
                sortDesc: true,
                showDropdown: false,
                selected: {},
                options: [
                    {
                        value: 'popular',
                        label: 'Popularity'
                    },
                    {
                        value: 'title',
                        label: 'Title'
                    },
                    {
                        value: 'artist',
                        label: 'Artist'
                    },
                    {
                        value: 'random',
                        label: 'Random'
                    }
                ]
            }
        },
        mounted() {
            this.selected = this.options[0];
            document.addEventListener('click', this.onDocumentClick)
        },
        destroyed () {
            document.removeEventListener('click', this.onDocumentClick)
        },
        methods: {
            onSelect(option) {
                this.showDropdown = false;
                this.selected = option;
                this.$root.$emit(events.SORT.SORT_CHANGED, option.value);
            },
            onDocumentClick(e) {
                let dropdown = this.$refs.dropdownMenu;
                let toggle = this.$refs.dropdownToggle;
                let target = e.target;
                if ((dropdown !== target && !dropdown.contains(target)) && (toggle !== target && !toggle.contains(target))) {
                    this.showDropdown = false;
                }
            },
            onSortChange() {
                this.sortDesc = !this.sortDesc;
            },
            onRandomClick() {
                this.selected = this.options[3];
            }
        }
    };
</script>

<style scoped lang="less">
    .playlist-sorter {
        display: flex;
        align-items: center;

        &-loading {
            position: absolute;
            right: 15px;
            top: 9px;
        }
        .playlist-controls-item {
            margin-left: 10px;
        }
        .sorter-dropdown {
            position: relative;
            a {
                width: 120px;
                box-sizing: border-box;
                text-align: left;

                .fa {
                    float: right;
                    top: 4px;
                    position: relative;
                }
            }
            ul {
                position: absolute;
                list-style: none;
                margin: 0;
                padding: 0;
                right: 0;
                top: 100%;
                width: 118px;
                background: #fff;
                border: 1px solid #cecece;
                border-top: none;
                color: #7d7d7d;
                z-index: 500;

                li {
                    padding: 5px 15px;

                    &:hover,
                    &.selected {
                        background-color: rgba(125, 125, 125, 0.1);
                        color: #7d7d7d;
                        cursor: pointer;
                    }

                    &.selected {
                        color: #000;
                    }
                }
            }
        }
        .sort-value {
            padding-right: 10px;
        }
    }
</style>
