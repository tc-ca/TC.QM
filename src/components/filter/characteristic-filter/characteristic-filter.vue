<template>
  <v-navigation-drawer
    v-model="showDrawer"
    app
    right
    temporary
    :width="width"
  >
    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-content>
          <!-- TITLE -->
          <v-list-item-title class="title">
            {{ $t('app.questionnaire.siteFilter.title') }}
          </v-list-item-title>
        </v-list-item-content>
        <!-- CLOSE DRAWER ACTION BUTTON -->
        <v-list-item-action>
          <v-btn
            icon
            @click="showDrawer = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <!-- FILTERS -->
      <div
        v-for="characteristic in characteristics"
        :key="characteristic.id"
      >
        <v-list-item-content>
          <characteristic-filter-lookup
            :item="characteristic"
            :items="characteristic.children"
            :values="siteCharacteristics"
            :update-filter="updateProvisionFilter"
            :label="characteristic.text[lang]"
            @update-displayed-tags="onUpdateDisplayedTags"
            @mounted="onMountedFilterLookup()"
          />

          <v-divider />
        </v-list-item-content>
      </div>
      <!-- CHIPS -->
      <div>
        <v-chip
          v-for="item in siteCharacteristics"

          :key="item.id"
          class="ma-2"
          close
          @click:close="removeSiteCharacteristic(item.id)"
        >
          {{ item.text[lang] }}
        </v-chip>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import BaseMixin from '../../../mixins/base'
import CharacteristicFilterLookup from './characteristic-filter-lookup.vue'
import { mapState } from 'vuex'

export default {
  components: { CharacteristicFilterLookup },
  events: ['close-characteristic-filter-drawer', 'update-site-characteristic-count'],
  mixins: [BaseMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      characteristics: [],
      siteCharacteristics: [],
      isCharactericticDataSet: false,
      isSiteCharacterticDataSet: false,
      updateProvisionFilter: false
    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    }),
    showDrawer: {
      get () {
        return this.show
      },
      set (val) {
        if (!val) {
          this.$emit('close-characteristic-filter-drawer')
        }
      }
    },
    width () {
      return this.$vuetify.breakpoint.mobile ? '100%' : '40%'
    }
  },
  watch: {
    siteCharacteristics (newValue, oldValue) {
      this.$emit('update-site-characteristic-count', newValue.length)
    }
  },
  async mounted () {
    // keep this code on top of mounted method
    // so we can subscribe to mutation within this method
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'SET_CHARACTERISTICS':
        {
          this.characteristics = this.$store.state.characteristics.characteristics

          // const nonHydratedSiteCharacterictics = this.$store.state.characteristics.siteCharacteristics
          // // hydrates the site characteristics which are just list of ids, we need full objects with provisions etc...
          // for (let i = 0; i < nonHydratedSiteCharacterictics.length; i++) {
          //   const dryCharacteristic = nonHydratedSiteCharacterictics[i]
          //   const hydratedCharacteristic = this.findItemInCollection(this.characteristics, dryCharacteristic)
          //   this.siteCharacteristics.push(hydratedCharacteristic)
          // }

          this.isCharactericticDataSet = true

          break
        }
        case 'UPDATE_ORIGINAL_TAG_FILTER_STATE':
        {
          // sets any default/inital active site characteristics
          // should only be run once
          if (!this.isSiteCharacterticDataSet) {
            const nonHydratedSiteCharacterictics = this.$store.state.characteristics.siteCharacteristics
            // hydrates the site characteristics which are just list of ids, we need full objects with provisions etc...
            for (let i = 0; i < nonHydratedSiteCharacterictics.length; i++) {
              const dryCharacteristic = nonHydratedSiteCharacterictics[i]
              const hydratedCharacteristic = this.findItemInCollection(this.characteristics, dryCharacteristic)
              this.siteCharacteristics.push(hydratedCharacteristic)
            }
            this.isSiteCharacterticDataSet = true
          }

          break
        }
        default:
          break
      }
    })
  },
  methods: {
    // todo move this to util
    findItemInCollection (collection, target) {
      let item = null
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === target) {
          item = collection[i]
          return item
        } else if (collection[i].children.length > 0) {
          item = this.findItemInCollection(collection[i].children, target)
          if (item) {
            return item
          }
          continue
        }
      }
    },
    removeSiteCharacteristic (id) {
      const itemIndex = this.siteCharacteristics.findIndex(characteristic => characteristic.id === id)
      if (itemIndex !== -1) {
        this.siteCharacteristics.splice(itemIndex, 1)
      }
    },
    onUpdateDisplayedTags (values) {
      this.siteCharacteristics = values
    },
    onMountedFilterLookup () {
      if (this.isCharactericticDataSet) {
        this.updateProvisionFilter = true
      }
    }
  }
}
</script>
